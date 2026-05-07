import { Component, Input, HostBinding } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [disabled]="disabled"
      [type]="type"
      class="btn"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-secondary]="variant === 'secondary'"
      [class.btn-ghost]="variant === 'ghost'"
      [class.btn-danger]="variant === 'danger'"
      [class.btn-soft]="variant === 'soft'"
      [class.btn-gradient]="variant === 'gradient'"
      [class.btn-sm]="size === 'sm'"
      [class.btn-lg]="size === 'lg'"
      [class.w-full]="fullWidth"
    >
      @if (loading) {
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: string = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
}
