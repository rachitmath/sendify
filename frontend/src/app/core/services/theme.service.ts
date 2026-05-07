import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('sendify-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved ? saved === 'dark' : prefersDark;
      this.isDark.set(initial);
      this.applyTheme(initial);

      effect(() => {
        const dark = this.isDark();
        this.applyTheme(dark);
        localStorage.setItem('sendify-theme', dark ? 'dark' : 'light');
      });
    }
  }

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
