export interface UploadProgress {
  uploadId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  chunkSize: number;
  totalChunks: number;
  chunksReceived: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

export interface ChunkUploadResult {
  chunkIndex: number;
  received: boolean;
  totalReceived: number;
  totalChunks: number;
}
