import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="w-full">
      <div class="flex items-center justify-between mb-2">
        @if (label) {
          <span class="text-sm text-slate-600 font-medium">{{ label }}</span>
        }
        @if (showPercentage) {
          <span class="text-sm font-semibold tabular-nums" [class.text-slate-600]="!isComplete" [class.text-green-600]="isComplete">
            {{ percentage }}%
          </span>
        }
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300 ease-out"
          [class.bg-gradient-to-r]="!isError"
          [class.from-indigo-500]="!isComplete && !isError"
          [class.to-indigo-600]="!isComplete && !isError"
          [class.bg-green-500]="isComplete"
          [class.bg-red-500]="isError"
          [style.width.%]="indeterminate ? 100 : percentage"
        ></div>
      </div>
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() percentage = 0;
  @Input() label?: string;
  @Input() showPercentage = true;
  @Input() indeterminate = false;

  get isComplete(): boolean {
    return this.percentage >= 100;
  }

  get isError(): boolean {
    return this.percentage < 0;
  }
}
