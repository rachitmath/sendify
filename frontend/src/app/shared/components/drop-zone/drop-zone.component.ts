import { Component, Output, EventEmitter, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  template: `
    <div
      class="drop-zone relative flex flex-col items-center justify-center p-10 cursor-pointer min-h-[280px]"
      [class.drop-zone-active]="isDragOver()"
      [class.drop-zone-error]="hasError()"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        class="hidden"
        [multiple]="multiple"
        [accept]="accept"
        (change)="onFileSelect($event)"
      />

      <div class="text-center">
        @if (isDragOver()) {
          <div class="mb-5">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-indigo-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <p class="text-lg font-semibold text-indigo-600">Drop to upload</p>
        } @else {
          <div class="mb-5">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center transition-colors duration-200 group-hover:bg-indigo-50">
              <svg class="w-10 h-10 text-slate-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <p class="text-base font-medium text-slate-700">
            Drag and drop files here, or
            <span class="text-indigo-600 font-semibold hover:underline">browse</span>
          </p>
          <p class="mt-3 text-sm text-slate-500">
            Maximum file size: {{ maxSizeLabel }}
          </p>
        }
      </div>
    </div>
  `,
})
export class DropZoneComponent {
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragOver = signal(false);
  hasError = signal(false);

  multiple = true;
  accept = '*/*';
  maxSizeBytes = 5 * 1024 * 1024 * 1024;

  get maxSizeLabel(): string {
    if (this.maxSizeBytes >= 1024 * 1024 * 1024) {
      return `${this.maxSizeBytes / (1024 * 1024 * 1024)}GB`;
    }
    return `${this.maxSizeBytes / (1024 * 1024)}MB`;
  }

  @HostListener('document:dragover', ['$event'])
  onDocumentDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
      input.value = '';
    }
  }

  private handleFiles(fileList: File[]): void {
    const validFiles = fileList.filter((file) => {
      if (file.size > this.maxSizeBytes) {
        this.showError();
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      this.filesSelected.emit(validFiles);
      this.hasError.set(false);
    }
  }

  private showError(): void {
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 2000);
  }
}
