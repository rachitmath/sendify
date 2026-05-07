import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { FileItem } from '../../../core/services/upload.service';

@Component({
  selector: 'app-file-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      class="flex items-center gap-3 p-3 bg-white rounded-xl border transition-all duration-200"
      [class.border-slate-200]="file.status === 'pending'"
      [class.border-indigo-200]="file.status === 'uploading'"
      [class.border-green-200]="file.status === 'completed'"
      [class.border-red-200]="file.status === 'error'"
      [class.bg-slate-50]="file.status === 'completed'"
      [class.bg-red-50]="file.status === 'error'">
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        [class.bg-indigo-100]="getFileColor() === 'blue'"
        [class.bg-green-100]="getFileColor() === 'green'"
        [class.bg-amber-100]="getFileColor() === 'amber'"
        [class.bg-purple-100]="getFileColor() === 'purple'"
        [class.bg-pink-100]="getFileColor() === 'pink'"
        [class.bg-red-100]="getFileColor() === 'red'">
        <svg
          class="w-5 h-5"
          [class.text-indigo-600]="getFileColor() === 'blue'"
          [class.text-green-600]="getFileColor() === 'green'"
          [class.text-amber-600]="getFileColor() === 'amber'"
          [class.text-purple-600]="getFileColor() === 'purple'"
          [class.text-pink-600]="getFileColor() === 'pink'"
          [class.text-red-600]="getFileColor() === 'red'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="getFileIcon()" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-900 truncate" [title]="file.name">
          {{ file.name }}
        </p>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="text-xs text-slate-500 font-mono">{{ formatSize(file.size) }}</span>
          <span class="text-xs text-indigo-600 font-medium" *ngIf="file.status === 'uploading'">{{ file.progress }}%</span>
          <span class="text-xs text-green-600 font-medium" *ngIf="file.status === 'completed'">Done</span>
          <span class="text-xs text-red-600" *ngIf="file.status === 'error'">{{ file.error }}</span>
        </div>
      </div>

      <button
        *ngIf="file.status === 'uploading' || file.status === 'pending'"
        (click)="onRemove.emit(file.id)"
        class="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        *ngIf="file.status === 'error'"
        (click)="onRetry.emit(file.id)"
        class="flex-shrink-0 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <div *ngIf="file.status === 'completed'" class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <div *ngIf="file.status === 'uploading'" class="h-1 bg-slate-100 rounded-full -mt-1 mx-3 mb-1 overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
        [style.width.%]="file.progress">
      </div>
    </div>
  `,
})
export class FileCardComponent {
  @Input({ required: true }) file!: FileItem;
  @Output() onRemove = new EventEmitter<string>();
  @Output() onRetry = new EventEmitter<string>();

  getFileColor(): string {
    if (this.isImage()) return 'blue';
    if (this.isVideo()) return 'purple';
    if (this.isAudio()) return 'pink';
    if (this.isPdf()) return 'red';
    return 'green';
  }

  getFileIcon(): string {
    if (this.isImage()) {
      return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    }
    if (this.isVideo()) {
      return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
    }
    if (this.isAudio()) {
      return 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z';
    }
    return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
  }

  isImage(): boolean {
    return this.file.type.startsWith('image/');
  }

  isVideo(): boolean {
    return this.file.type.startsWith('video/');
  }

  isAudio(): boolean {
    return this.file.type.startsWith('audio/');
  }

  isPdf(): boolean {
    return this.file.type === 'application/pdf';
  }

  formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    if (bytes >= 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return bytes + ' B';
  }
}
