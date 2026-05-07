import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema({ timestamps: true, collection: 'uploads' })
export class Upload {
  @Prop({ required: true, unique: true, index: true })
  uploadId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  chunkSize: number;

  @Prop({ required: true })
  totalChunks: number;

  @Prop({ type: [Number], default: [] })
  chunksReceived: number[];

  @Prop({
    type: String,
    enum: UploadStatus,
    default: UploadStatus.PENDING,
  })
  status: UploadStatus;

  @Prop({ type: String })
  multipartUploadId?: string;

  @Prop({ type: [String], default: [] })
  uploadedParts: string[];

  @Prop({ required: true, index: true })
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

UploadSchema.index({ expiresAt: 1 });
UploadSchema.index({ status: 1 });
