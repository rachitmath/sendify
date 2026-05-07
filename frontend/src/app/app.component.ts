import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      <header class="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
              <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm shadow-primary-200/50 group-hover:shadow-md group-hover:shadow-primary-300/40 transition-all duration-200">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span class="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Sendify</span>
            </a>

            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/upload" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer">
                <svg class="w-4 h-4 inline mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </a>
              <a href="/#features" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer">
                Features
              </a>
              <a href="/#pricing" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 cursor-pointer">
                Pricing
              </a>
            </nav>

            <div class="flex items-center gap-2">
              <button
                (click)="themeService.toggle()"
                class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
              >
                @if (themeService.isDark()) {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                } @else {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
              </button>

              <button
                class="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                (click)="mobileMenuOpen = !mobileMenuOpen"
                aria-label="Toggle menu"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  @if (mobileMenuOpen) {
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>

          @if (mobileMenuOpen) {
            <div class="md:hidden pb-4 border-t border-slate-100 dark:border-slate-700/50 mt-2 pt-4 animate-fade-in-down">
              <nav class="flex flex-col gap-1">
                <a routerLink="/upload" (click)="mobileMenuOpen = false" class="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                  Upload
                </a>
                <a href="/#features" (click)="mobileMenuOpen = false" class="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                  Features
                </a>
                <a href="/#pricing" (click)="mobileMenuOpen = false" class="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                  Pricing
                </a>
              </nav>
            </div>
          }
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div class="col-span-2 md:col-span-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span class="font-bold text-base text-slate-900 dark:text-white">Sendify</span>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Secure file sharing powered by AI. Send files with confidence.
              </p>
            </div>
            <div>
              <h4 class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Product</h4>
              <ul class="space-y-2">
                <li><a routerLink="/upload" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Upload</a></li>
                <li><a href="/#features" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Features</a></li>
                <li><a href="/#pricing" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Legal</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Privacy</a></li>
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Terms</a></li>
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Connect</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Twitter</a></li>
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">GitHub</a></li>
                <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">Discord</a></li>
              </ul>
            </div>
          </div>
          <div class="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p class="text-center text-sm text-slate-400 dark:text-slate-500">
              &copy; {{ year }} Sendify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <app-toast />
    </div>
  `,
})
export class AppComponent {
  protected readonly themeService = inject(ThemeService);
  protected mobileMenuOpen = false;
  protected readonly year = new Date().getFullYear();
}
