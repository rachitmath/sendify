import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

interface FileInfo {
  originalName: string;
  fileSize: number;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
}

@Component({
  selector: 'app-share-success',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div class="text-center mb-10 animate-fade-in-up">
        <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Ready to share</h1>
        <p class="text-base text-slate-500 dark:text-slate-400">Your secure download link has been created</p>
      </div>

      <div class="space-y-5 animate-fade-in-up">
        <app-card variant="hover" padding="md">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Your secure download link
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              [value]="downloadUrl"
              readonly
              class="input flex-1 font-mono text-sm"
            />
            <app-button variant="primary" (click)="copyLink()">
              @if (copied()) {
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              }
            </app-button>
          </div>
        </app-card>

        @if (fileInfo()) {
          <app-card variant="default" padding="md">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">File details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">File name</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ fileInfo()!.originalName }}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">File size</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white font-mono">{{ formatSize(fileInfo()!.fileSize) }}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Expires</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ formatExpiry(fileInfo()!.expiresAt) }}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Downloads</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  @if (fileInfo()!.maxDownloads === -1) {
                    Unlimited
                  } @else {
                    {{ fileInfo()!.downloadCount }} / {{ fileInfo()!.maxDownloads }}
                  }
                </p>
              </div>
            </div>
          </app-card>
        }

        <div class="flex flex-col sm:flex-row gap-3">
          <a routerLink="/share/{{ shareId() }}" class="flex-1">
            <app-button variant="gradient" [fullWidth]="true">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </app-button>
          </a>
          <app-button variant="secondary" [fullWidth]="true" (click)="uploadMore()">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Upload more
          </app-button>
        </div>

        <div class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
          <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-amber-800 dark:text-amber-300">Link will expire</p>
            <p class="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
              This file will be automatically deleted after the expiry period. Download it before it's gone.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShareSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  shareId = signal('');
  downloadUrl = '';
  fileInfo = signal<FileInfo | null>(null);
  copied = signal(false);

  async ngOnInit(): Promise<void> {
    this.shareId.set(this.route.snapshot.paramMap.get('shareId') || '');
    this.downloadUrl = `${window.location.origin}/download/${this.shareId()}`;

    try {
      const info = await this.api.get<FileInfo>(`/files/${this.shareId()}`).toPromise();
      this.fileInfo.set(info || null);
    } catch {
      // File info is optional for the success page
    }
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.downloadUrl);
      this.copied.set(true);
      this.toast.success('Link copied to clipboard!');

      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.toast.error('Failed to copy link');
    }
  }

  uploadMore(): void {
    this.router.navigate(['/']);
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

  formatExpiry(dateStr: string): string {
    const expiry = new Date(dateStr);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Less than 1 hour';
  }
}
