import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

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
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Files ready to share</h1>
        <p class="text-slate-600">Your secure download link has been created</p>
      </div>

      <div class="card p-6 mb-6 animate-in">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Your download link
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            [value]="downloadUrl"
            readonly
            class="input flex-1 font-mono text-sm"
          />
          <button
            (click)="copyLink()"
            class="btn-primary px-4"
          >
            @if (copied()) {
              <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            }
          </button>
        </div>
      </div>

      @if (fileInfo()) {
        <div class="card p-6 mb-6">
          <h3 class="text-sm font-medium text-slate-700 mb-4">Details</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500">File name</p>
              <p class="text-sm font-medium text-slate-900 truncate">{{ fileInfo()!.originalName }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">File size</p>
              <p class="text-sm font-medium text-slate-900 font-mono">{{ formatSize(fileInfo()!.fileSize) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Expires</p>
              <p class="text-sm font-medium text-slate-900">{{ formatExpiry(fileInfo()!.expiresAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Downloads</p>
              <p class="text-sm font-medium text-slate-900">
                @if (fileInfo()!.maxDownloads === -1) {
                  Unlimited
                } @else {
                  {{ fileInfo()!.downloadCount }} / {{ fileInfo()!.maxDownloads }}
                }
              </p>
            </div>
          </div>
        </div>
      }

      <div class="flex flex-col sm:flex-row gap-4">
        <a
          [href]="downloadUrl"
          class="btn-primary flex-1 text-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
        <button
          (click)="uploadMore()"
          class="btn-secondary flex-1"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Upload more
        </button>
      </div>

      <div class="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div class="flex gap-3">
          <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-amber-800">Important</p>
            <p class="text-sm text-amber-700 mt-1">
              This link will expire and the file will be automatically deleted after the expiry period. 
              Make sure to download the file before it expires.
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
      // Ignore errors - file info is optional for the success page
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

  formatExpiry(dateStr: string): string {
    const expiry = new Date(dateStr);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) {
      return 'Expired';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return 'Less than 1 hour';
  }
}
