import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../../core/services/download.service';
import { ToastService } from '../../core/services/toast.service';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-download-page',
  standalone: true,
  imports: [FormsModule, ProgressBarComponent],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        @if (downloadService.isLoading() && !downloadService.fileInfo()) {
          <div class="card p-10 text-center animate-fade-in">
            <div class="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <svg class="animate-spin w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-base text-slate-600 font-medium">Loading file...</p>
          </div>
        } @else if (downloadService.error() && !downloadService.fileInfo()) {
          <div class="card p-8 text-center animate-fade-in">
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-900 mb-2">File Not Available</h2>
            <p class="text-sm text-slate-600 mb-6">{{ downloadService.error() }}</p>
            <a href="/" class="btn-primary inline-flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Upload new files
            </a>
          </div>
        } @else if (downloadService.fileInfo()) {
          <div class="card p-8 animate-scale-in">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                <svg class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-slate-900 mb-1">{{ downloadService.fileInfo()!.originalName }}</h2>
              <p class="text-sm text-slate-500 font-mono">{{ formatSize(downloadService.fileInfo()!.fileSize) }}</p>
            </div>

            @if (downloadService.fileInfo()!.passwordEnabled && !passwordVerified()) {
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    This file is password protected
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="password"
                    (keyup.enter)="verifyPassword()"
                    placeholder="Enter password"
                    class="input"
                    [class.input-error]="downloadService.error()"
                  />
                  @if (downloadService.error()) {
                    <p class="mt-2 text-sm text-red-600">{{ downloadService.error() }}</p>
                  }
                </div>
                <button
                  (click)="verifyPassword()"
                  [disabled]="!password || downloadService.isLoading()"
                  class="btn-primary w-full"
                >
                  @if (downloadService.isLoading()) {
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  } @else {
                    Verify Password
                  }
                </button>
              </div>
            } @else {
              @if (downloadService.downloadProgress() > 0 && downloadService.downloadProgress() < 100) {
                <div class="mb-6">
                  <app-progress-bar
                    [percentage]="downloadService.downloadProgress()"
                    label="Downloading..."
                  />
                </div>
              }

              <button
                (click)="download()"
                [disabled]="downloadService.isLoading()"
                class="btn-primary w-full"
              >
                @if (downloadService.isLoading()) {
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                } @else {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download File
                }
              </button>
            }

            <div class="mt-6 pt-5 border-t border-slate-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Expires</span>
                <span class="text-slate-700 font-medium">{{ formatExpiry(downloadService.fileInfo()!.expiresAt) }}</span>
              </div>
              @if (downloadService.fileInfo()!.maxDownloads > 0) {
                <div class="flex items-center justify-between text-sm mt-2">
                  <span class="text-slate-500">Downloads</span>
                  <span class="text-slate-700 font-medium">{{ downloadService.fileInfo()!.downloadCount }} / {{ downloadService.fileInfo()!.maxDownloads }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DownloadPageComponent implements OnInit {
  protected readonly downloadService = inject(DownloadService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  password = '';
  passwordVerified = signal(false);
  private shareId = '';

  async ngOnInit(): Promise<void> {
    this.shareId = this.route.snapshot.paramMap.get('shareId') || '';
    
    if (this.shareId) {
      await this.downloadService.loadFileInfo(this.shareId);
    }
  }

  async verifyPassword(): Promise<void> {
    if (!this.password) return;

    const isValid = await this.downloadService.verifyPassword(this.shareId, this.password);
    
    if (isValid) {
      this.passwordVerified.set(true);
      this.downloadService.error.set(null);
    }
  }

  async download(): Promise<void> {
    try {
      await this.downloadService.downloadFile(this.shareId);
      this.toast.success('Download started!');
    } catch {
      this.toast.error('Download failed. Please try again.');
    }
  }

  formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  }

  formatExpiry(date: Date): string {
    const expiry = new Date(date);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) {
      return 'Expired';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    }
    return 'Less than 1 hour';
  }
}
