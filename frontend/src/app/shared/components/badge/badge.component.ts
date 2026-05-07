import { Component, Input } from '@angular/core';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [class.badge-primary]="variant === 'primary'"
      [class.badge-success]="variant === 'success'"
      [class.badge-warning]="variant === 'warning'"
      [class.badge-danger]="variant === 'danger'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
}
