import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true, collection: 'files' })
export class File {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  shareId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ default: false })
  passwordEnabled: boolean;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ default: -1 })
  maxDownloads: number;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ type: [String], default: [] })
  notifyEmails: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  uploadedBy?: Types.ObjectId;

  @Prop()
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.index({ expiresAt: 1 });
FileSchema.index({ createdAt: 1 });
FileSchema.index({ uploadedBy: 1 });

FileSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
