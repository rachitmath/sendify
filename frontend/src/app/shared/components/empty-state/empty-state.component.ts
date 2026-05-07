import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
        <ng-content select="[icon]" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1">{{ title }}</h3>
      @if (description) {
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{{ description }}</p>
      }
      @if (action) {
        <div class="mt-6">
          <ng-content select="[action]" />
        </div>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() action = false;
}
