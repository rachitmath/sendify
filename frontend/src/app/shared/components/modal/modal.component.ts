import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="close.emit()" />
        <div
          class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in border border-slate-200 dark:border-slate-700"
          [class.max-w-lg]="size === 'lg'"
          [class.max-w-sm]="size === 'sm'"
        >
          @if (showClose) {
            <button
              (click)="close.emit()"
              class="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
          <div class="p-6">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Input() showClose = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close.emit();
    }
  }
}
