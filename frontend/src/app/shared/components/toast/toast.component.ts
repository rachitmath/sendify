import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        @if (toast.type === 'success') {
          <div class="flex items-start gap-3 p-4 rounded-xl shadow-lg border border-green-200 bg-white animate-slide-up" role="alert">
            <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-sm text-slate-700 flex-1 leading-snug">{{ toast.message }}</p>
            <button (click)="toastService.dismiss(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }
        @if (toast.type === 'error') {
          <div class="flex items-start gap-3 p-4 rounded-xl shadow-lg border border-red-200 bg-white animate-slide-up" role="alert">
            <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p class="text-sm text-slate-700 flex-1 leading-snug">{{ toast.message }}</p>
            <button (click)="toastService.dismiss(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }
        @if (toast.type === 'warning') {
          <div class="flex items-start gap-3 p-4 rounded-xl shadow-lg border border-amber-200 bg-white animate-slide-up" role="alert">
            <div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <p class="text-sm text-slate-700 flex-1 leading-snug">{{ toast.message }}</p>
            <button (click)="toastService.dismiss(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }
        @if (toast.type === 'info') {
          <div class="flex items-start gap-3 p-4 rounded-xl shadow-lg border border-indigo-200 bg-white animate-slide-up" role="alert">
            <div class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
              </svg>
            </div>
            <p class="text-sm text-slate-700 flex-1 leading-snug">{{ toast.message }}</p>
            <button (click)="toastService.dismiss(toast.id)" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
