import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadId?: string;
}

export interface UploadOptions {
  password?: string;
  expiresAt?: string;
  maxDownloads?: number;
  notifyEmails?: string[];
}

export interface UploadResult {
  fileId: string;
  shareId: string;
  downloadUrl: string;
}

export interface ChunkUploadResponse {
  uploadId: string;
  chunkSize: number;
  totalChunks: number;
  expiresAt: Date;
}

export interface ChunkResponse {
  chunkIndex: number;
  received: boolean;
  totalReceived: number;
  totalChunks: number;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly api = inject(ApiService);
  private readonly chunkSize = environment.uploadChunkSize;
  private readonly concurrency = environment.uploadConcurrency;

  files = signal<FileItem[]>([]);
  
  totalFiles = computed(() => this.files().length);
  completedFiles = computed(() => this.files().filter((f) => f.status === 'completed').length);
  isUploading = computed(() => this.files().some((f) => f.status === 'uploading'));
  hasFiles = computed(() => this.files().length > 0);

  addFiles(files: File[]): void {
    const newFiles: FileItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
    }));

    this.files.update((current) => [...current, ...newFiles]);
  }

  removeFile(id: string): void {
    this.files.update((current) => current.filter((f) => f.id !== id));
  }

  clearFiles(): void {
    this.files.set([]);
  }

  updateFileProgress(id: string, progress: number): void {
    this.files.update((current) =>
      current.map((f) => (f.id === id ? { ...f, progress } : f)),
    );
  }

  updateFileStatus(id: string, status: FileItem['status'], error?: string): void {
    this.files.update((current) =>
      current.map((f) =>
        f.id === id ? { ...f, status, error, progress: status === 'completed' ? 100 : f.progress } : f,
      ),
    );
  }

  async uploadAll(options: UploadOptions = {}): Promise<UploadResult | null> {
    const pendingFiles = this.files().filter((f) => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      return null;
    }

    for (const fileItem of pendingFiles) {
      this.updateFileStatus(fileItem.id, 'uploading');

      try {
        if (fileItem.size > this.chunkSize) {
          await this.uploadChunked(fileItem, options);
        } else {
          await this.uploadSimple(fileItem, options);
        }

        this.updateFileStatus(fileItem.id, 'completed');
      } catch (error) {
        this.updateFileStatus(fileItem.id, 'error', error instanceof Error ? error.message : 'Upload failed');
      }
    }

    const completed = this.files().find((f) => f.status === 'completed');
    if (completed?.uploadId) {
      return {
        fileId: completed.id,
        shareId: completed.uploadId,
        downloadUrl: `${window.location.origin}/download/${completed.uploadId}`,
      };
    }

    return null;
  }

  private async uploadSimple(fileItem: FileItem, options: UploadOptions): Promise<void> {
    const formData = new FormData();
    formData.append('file', fileItem.file);
    if (options.password) formData.append('password', options.password);
    if (options.expiresAt) formData.append('expiresAt', options.expiresAt);
    if (options.notifyEmails) formData.append('notifyEmails', options.notifyEmails.join(','));

    const response = await this.api.postFormData<UploadResult>('/upload/simple', formData).toPromise();
    
    if (response) {
      this.files.update((current) =>
        current.map((f) =>
          f.id === fileItem.id ? { ...f, uploadId: response.shareId } : f,
        ),
      );
    }
  }

  private async uploadChunked(fileItem: FileItem, options: UploadOptions): Promise<void> {
    const initiateResponse = await this.api
      .post<ChunkUploadResponse>('/upload/initiate', {
        fileName: fileItem.name,
        fileSize: fileItem.size,
        mimeType: fileItem.type,
        chunkSize: this.chunkSize,
      })
      .toPromise();

    if (!initiateResponse) {
      throw new Error('Failed to initiate upload');
    }

    this.files.update((current) =>
      current.map((f) =>
        f.id === fileItem.id ? { ...f, uploadId: initiateResponse.uploadId } : f,
      ),
    );

    const totalChunks = initiateResponse.totalChunks;
    const chunkSize = initiateResponse.chunkSize;

    const chunks: ArrayBuffer[] = [];
    let offset = 0;

    while (offset < fileItem.size) {
      const chunk = fileItem.file.slice(offset, offset + chunkSize);
      const arrayBuffer = await chunk.arrayBuffer();
      chunks.push(arrayBuffer);
      offset += chunkSize;
    }

    const chunksCompleted = new Set<number>();

    const uploadChunk = async (chunkIndex: number): Promise<void> => {
      if (chunksCompleted.has(chunkIndex)) return;

      const formData = new FormData();
      formData.append('chunk', new Blob([chunks[chunkIndex]]));
      formData.append('chunkIndex', chunkIndex.toString());

      await this.api.postFormData<ChunkResponse>(
        `/upload/chunk/${initiateResponse.uploadId}`,
        formData,
      ).toPromise();

      chunksCompleted.add(chunkIndex);
      const progress = Math.round((chunksCompleted.size / totalChunks) * 100);
      this.updateFileProgress(fileItem.id, progress);
    };

    const batchSize = this.concurrency;
    for (let i = 0; i < totalChunks; i += batchSize) {
      const batch = Array.from({ length: Math.min(batchSize, totalChunks - i) }, (_, j) => i + j);
      await Promise.all(batch.map(uploadChunk));
    }

    const completeResponse = await this.api
      .post<UploadResult>(`/upload/complete/${initiateResponse.uploadId}`, {
        fileName: fileItem.name,
        mimeType: fileItem.type,
        password: options.password,
        expiresAt: options.expiresAt,
        maxDownloads: options.maxDownloads,
        notifyEmails: options.notifyEmails,
      })
      .toPromise();

    if (completeResponse) {
      this.files.update((current) =>
        current.map((f) =>
          f.id === fileItem.id ? { ...f, uploadId: completeResponse.shareId } : f,
        ),
      );
    }
  }

  cancelUpload(id: string): void {
    const fileItem = this.files().find((f) => f.id === id);
    if (fileItem?.uploadId) {
      this.api.post(`/upload/cancel/${fileItem.uploadId}`, {}).subscribe();
    }
    this.removeFile(id);
  }
}
