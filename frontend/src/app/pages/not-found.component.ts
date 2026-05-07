import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4">
      <div class="text-center max-w-md animate-fade-in-up">
        <div class="text-8xl font-bold text-slate-200 dark:text-slate-700/50 mb-4">404</div>
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Page not found</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/">
          <app-button variant="primary">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go home
          </app-button>
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
