import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface FileInfo {
  shareId: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  passwordEnabled: boolean;
  expiresAt: Date;
  maxDownloads: number;
  downloadCount: number;
  createdAt: Date;
}

export interface DownloadInfo {
  fileCount: number;
  totalSize: number;
  expiresAt: Date;
  passwordEnabled: boolean;
  originalName: string;
  mimeType: string;
}

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly api = inject(ApiService);

  fileInfo = signal<FileInfo | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  downloadProgress = signal(0);

  async loadFileInfo(shareId: string): Promise<FileInfo | null> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const info = await this.api.get<FileInfo>(`/files/${shareId}`).toPromise();
      this.fileInfo.set(info || null);
      return info || null;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load file info');
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async verifyPassword(shareId: string, password: string): Promise<boolean> {
    try {
      const response = await this.api
        .post<{ valid: boolean; message?: string }>(`/files/${shareId}/verify`, { password })
        .toPromise();

      if (response?.valid) {
        return true;
      }
      
      this.error.set('Incorrect password');
      return false;
    } catch {
      this.error.set('Incorrect password');
      return false;
    }
  }

  async downloadFile(shareId: string, password?: string): Promise<void> {
    this.isLoading.set(true);
    this.downloadProgress.set(0);

    try {
      const url = `/download/${shareId}${password ? `?password=${encodeURIComponent(password)}` : ''}`;
      
      const response = await fetch(`${this.api['baseUrl']}${url}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Download failed');
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response');
      }

      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (total > 0) {
          this.downloadProgress.set(Math.round((received / total) * 100));
        }
      }

      const blob = new Blob(chunks, { type: response.headers.get('content-type') || 'application/octet-stream' });
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'download';
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match) {
          filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
        }
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Download failed');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
