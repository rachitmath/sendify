import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DownloadService } from '../../core/services/download.service';
import { ToastService } from '../../core/services/toast.service';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-download-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ProgressBarComponent, ButtonComponent, CardComponent, SkeletonComponent],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        @if (downloadService.isLoading() && !downloadService.fileInfo()) {
          <app-card padding="lg">
            <div class="text-center space-y-4">
              <app-skeleton width="64px" height="64px" [circle]="true" />
              <app-skeleton width="60%" height="20px" />
              <app-skeleton width="40%" height="14px" />
              <div class="pt-4">
                <app-skeleton width="100%" height="44px" />
              </div>
            </div>
          </app-card>
        } @else if (downloadService.error() && !downloadService.fileInfo()) {
          <app-card padding="lg">
            <div class="text-center animate-fade-in">
              <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">File not available</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">{{ downloadService.error() }}</p>
              <a routerLink="/">
                <app-button variant="primary">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Upload new files
                </app-button>
              </a>
            </div>
          </app-card>
        } @else if (downloadService.fileInfo()) {
          <app-card padding="lg" variant="hover">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">{{ downloadService.fileInfo()!.originalName }}</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">{{ formatSize(downloadService.fileInfo()!.fileSize) }}</p>
            </div>

            @if (downloadService.fileInfo()!.passwordEnabled && !passwordVerified()) {
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      This file is password protected
                    </div>
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="password"
                    (keyup.enter)="verifyPassword()"
                    placeholder="Enter password to access"
                    class="input"
                    [class.input-error]="!!downloadService.error()"
                  />
                  @if (downloadService.error()) {
                    <p class="mt-2 text-sm text-red-500">{{ downloadService.error() }}</p>
                  }
                </div>
                <app-button
                  variant="primary"
                  [fullWidth]="true"
                  [loading]="downloadService.isLoading()"
                  [disabled]="!password || downloadService.isLoading()"
                  (click)="verifyPassword()"
                >
                  @if (!downloadService.isLoading()) {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  {{ downloadService.isLoading() ? 'Verifying...' : 'Unlock & Download' }}
                </app-button>
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

              <app-button
                variant="gradient"
                [fullWidth]="true"
                [loading]="downloadService.isLoading()"
                [disabled]="downloadService.isLoading()"
                (click)="download()"
              >
                @if (!downloadService.isLoading()) {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
                {{ downloadService.isLoading() ? 'Downloading...' : 'Download file' }}
              </app-button>
            }

            <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500 dark:text-slate-400">Expires</span>
                <span class="text-slate-700 dark:text-slate-300 font-medium">{{ formatExpiry(downloadService.fileInfo()!.expiresAt) }}</span>
              </div>
              @if (downloadService.fileInfo()!.maxDownloads > 0) {
                <div class="flex items-center justify-between text-sm mt-2">
                  <span class="text-slate-500 dark:text-slate-400">Downloads</span>
                  <span class="text-slate-700 dark:text-slate-300 font-medium">{{ downloadService.fileInfo()!.downloadCount }} / {{ downloadService.fileInfo()!.maxDownloads }}</span>
                </div>
              }
            </div>
          </app-card>
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
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(i > 0 ? 2 : 0)} ${units[i]}`;
  }

  formatExpiry(date: Date): string {
    const expiry = new Date(date);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Less than 1 hour';
  }
}
