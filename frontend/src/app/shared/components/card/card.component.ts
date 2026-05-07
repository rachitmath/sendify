import { Component, Input } from '@angular/core';

type CardVariant = 'default' | 'hover' | 'glass' | 'gradient';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="card"
      [class.card-hover]="variant === 'hover'"
      [class.card-glass]="variant === 'glass'"
      [class.card-gradient]="variant === 'gradient'"
      [class.p-5]="padding === 'sm'"
      [class.p-6]="padding === 'md'"
      [class.p-8]="padding === 'lg'"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
}
