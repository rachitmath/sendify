import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropZoneComponent } from '../../shared/components/drop-zone/drop-zone.component';
import { FileCardComponent } from '../../shared/components/file-card/file-card.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { UploadService, UploadOptions } from '../../core/services/upload.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    FormsModule, DropZoneComponent, FileCardComponent,
    ProgressBarComponent, ButtonComponent, CardComponent,
  ],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-4">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          No signup required &middot; End-to-end encrypted
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          Send files with
          <span class="text-gradient">confidence</span>
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Upload your files, set your preferences, and share a secure link. It's that simple.
        </p>
      </div>

      @if (!uploadService.hasFiles()) {
        <div class="animate-fade-in-up">
          <app-drop-zone (filesSelected)="onFilesSelected($event)" />
        </div>

        <div class="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
          @for (stat of stats; track stat.label) {
            <div class="text-center">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stat.value }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="space-y-5 animate-fade-in-up">
          <app-card variant="default" padding="md">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold">
                  {{ uploadService.totalFiles() }}
                </span>
                <div>
                  <h2 class="text-base font-semibold text-slate-900 dark:text-white">
                    {{ uploadService.totalFiles() === 1 ? 'File' : 'Files' }} selected
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Click to add more files</p>
                </div>
              </div>
              <button
                (click)="clearAll()"
                class="text-sm text-slate-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div class="space-y-2 max-h-60 overflow-y-auto scrollbar-hide pr-1">
              @for (file of uploadService.files(); track file.id) {
                <app-file-card
                  [file]="file"
                  (onRemove)="uploadService.removeFile($event)"
                  (onRetry)="retryUpload($event)"
                />
              }
            </div>

            @if (uploadService.isUploading()) {
              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <app-progress-bar
                  [percentage]="overallProgress()"
                  label="Uploading..."
                  [showPercentage]="true"
                />
              </div>
            }
          </app-card>

          <app-card variant="default" padding="md">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Sharing options
            </h3>

            <div class="space-y-5">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  [(ngModel)]="options.passwordEnabled"
                  class="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      Password protection
                    </span>
                  </div>
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
                  class="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      Set expiration
                    </span>
                  </div>
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
                  class="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      Email notification
                    </span>
                  </div>
                  @if (options.emailNotify) {
                    <input
                      type="email"
                      [(ngModel)]="options.email"
                      placeholder="recipient@example.com"
                      class="input mt-2"
                    />
                  }
                </div>
              </label>
            </div>
          </app-card>

          <div class="flex flex-col sm:flex-row gap-3">
            <app-button variant="secondary" (click)="addMoreFiles()">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add more
            </app-button>
            <app-button
              variant="gradient"
              [fullWidth]="true"
              [loading]="uploadService.isUploading()"
              (click)="startUpload()"
              [disabled]="uploadService.isUploading()"
            >
              @if (!uploadService.isUploading()) {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              {{ uploadService.isUploading() ? 'Uploading...' : 'Send files' }}
            </app-button>
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

  protected stats = [
    { value: '5GB', label: 'Max file size' },
    { value: '256-bit', label: 'Encryption' },
    { value: '24/7', label: 'Availability' },
  ];

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
