import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropZoneComponent } from '../../shared/components/drop-zone/drop-zone.component';
import { FileCardComponent } from '../../shared/components/file-card/file-card.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { UploadService, UploadOptions } from '../../core/services/upload.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [FormsModule, DropZoneComponent, FileCardComponent, ProgressBarComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Send files securely
        </h1>
        <p class="text-base text-slate-600 max-w-md mx-auto">
          Upload your files and share them with a secure link. No signup required.
        </p>
      </div>

      @if (!uploadService.hasFiles()) {
        <app-drop-zone (filesSelected)="onFilesSelected($event)" />
      } @else {
        <div class="space-y-5 animate-fade-in">
          <div class="card p-5 md:p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
                  {{ uploadService.totalFiles() }}
                </span>
                <h2 class="text-base font-semibold text-slate-900">
                  {{ uploadService.totalFiles() === 1 ? 'file' : 'files' }} selected
                </h2>
              </div>
              <button
                (click)="clearAll()"
                class="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div class="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
              @for (file of uploadService.files(); track file.id) {
                <app-file-card
                  [file]="file"
                  (onRemove)="uploadService.removeFile($event)"
                  (onRetry)="retryUpload($event)"
                />
              }
            </div>

            @if (uploadService.isUploading()) {
              <div class="mt-4 pt-4 border-t border-slate-100">
                <app-progress-bar
                  [percentage]="overallProgress()"
                  label="Uploading..."
                  [showPercentage]="true"
                />
              </div>
            }
          </div>

          <div class="card p-5 md:p-6">
            <h3 class="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
              Sharing options
            </h3>
            
            <div class="space-y-4">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  [(ngModel)]="options.passwordEnabled"
                  class="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div class="flex-1">
                  <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    Password protection
                  </span>
                  @if (options.passwordEnabled) {
                    <input
                      type="password"
                      [(ngModel)]="options.password"
                      placeholder="Enter a secure password"
                      class="input mt-2"
                    />
                  }
                </div>
              </label>

              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  [(ngModel)]="options.expiryEnabled"
                  class="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div class="flex-1">
                  <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    Set expiration
                  </span>
                  @if (options.expiryEnabled) {
                    <select
                      [(ngModel)]="options.expiryValue"
                      class="input mt-2"
                    >
                      <option value="1">1 hour</option>
                      <option value="6">6 hours</option>
                      <option value="24">24 hours</option>
                      <option value="168">7 days</option>
                      <option value="720">30 days</option>
                    </select>
                  }
                </div>
              </label>

              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  [(ngModel)]="options.emailNotify"
                  class="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div class="flex-1">
                  <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    Email notification
                  </span>
                  @if (options.emailNotify) {
                    <input
                      type="email"
                      [(ngModel)]="options.email"
                      placeholder="recipient&#64;example.com"
                      class="input mt-2"
                    />
                  }
                </div>
              </label>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              (click)="addMoreFiles()"
              class="btn-secondary"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add more
            </button>
            <button
              (click)="startUpload()"
              [disabled]="uploadService.isUploading()"
              class="btn-primary flex-1"
            >
              @if (uploadService.isUploading()) {
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send files
              }
            </button>
          </div>
        </div>
      }
    </div>

    <input
      #fileInput
      type="file"
      class="hidden"
      multiple
      (change)="onFilesSelectedFromInput($event)"
    />
  `,
})
export class UploadPageComponent {
  protected readonly uploadService = inject(UploadService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  options: {
    passwordEnabled: boolean;
    password: string;
    expiryEnabled: boolean;
    expiryValue: string;
    emailNotify: boolean;
    email: string;
  } = {
    passwordEnabled: false,
    password: '',
    expiryEnabled: false,
    expiryValue: '24',
    emailNotify: false,
    email: '',
  };

  overallProgress = signal(0);

  onFilesSelected(files: File[]): void {
    this.uploadService.addFiles(files);
  }

  onFilesSelectedFromInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadService.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  addMoreFiles(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  clearAll(): void {
    this.uploadService.clearFiles();
  }

  retryUpload(id: string): void {
    this.uploadService.updateFileStatus(id, 'pending');
    this.uploadService.updateFileProgress(id, 0);
  }

  async startUpload(): Promise<void> {
    const uploadOptions: UploadOptions = {};

    if (this.options.passwordEnabled && this.options.password) {
      uploadOptions.password = this.options.password;
    }

    if (this.options.expiryEnabled) {
      const hours = parseInt(this.options.expiryValue, 10);
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      uploadOptions.expiresAt = expiresAt.toISOString();
    }

    if (this.options.emailNotify && this.options.email) {
      uploadOptions.notifyEmails = this.options.email.split(',').map((e) => e.trim());
    }

    try {
      const result = await this.uploadService.uploadAll(uploadOptions);

      if (result) {
        this.toast.success('Files uploaded successfully!');
        this.router.navigate(['/share', result.shareId]);
      }
    } catch (error) {
      this.toast.error(error instanceof Error ? error.message : 'Upload failed');
    }
  }
}
