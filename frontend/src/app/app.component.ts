import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-background-dark text-slate-100 font-sans relative overflow-hidden">
      <!-- Dynamic Background -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-blue/10 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
        <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary-violet/10 rounded-full blur-[100px] mix-blend-screen animate-blob" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-cyan/5 rounded-full blur-[150px] mix-blend-screen animate-blob" style="animation-delay: 4s;"></div>
        <div class="absolute inset-0 bg-grid opacity-20"></div>
      </div>

      <!-- Navigation -->
      <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background-dark/50 backdrop-blur-md border-b border-white/5">
        <a routerLink="/" class="text-2xl font-display tracking-widest text-white cursor-pointer hover:text-primary-cyan transition-colors">SENDIFY</a>
        
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a routerLink="/upload" class="hover:text-white transition-colors cursor-pointer">Upload</a>
          <a href="/#features" class="hover:text-white transition-colors">Features</a>
          <a href="/#workflow" class="hover:text-white transition-colors">Workflow</a>
          <a href="/#pricing" class="hover:text-white transition-colors">Pricing</a>
        </div>

        <div class="flex items-center gap-4">
          <button class="md:hidden p-2 text-slate-400 hover:text-white transition-colors" (click)="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              @if (mobileMenuOpen) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
          <button class="btn-secondary hidden sm:flex text-xs py-2 px-5">Log In</button>
          <button class="btn-primary py-2 px-5 text-xs hidden sm:flex">Start Free Trial</button>
        </div>
      </nav>

      @if (mobileMenuOpen) {
        <div class="fixed top-[73px] left-0 right-0 z-40 bg-background-darker border-b border-white/5 p-4 md:hidden">
          <nav class="flex flex-col gap-4">
            <a routerLink="/upload" (click)="mobileMenuOpen = false" class="text-slate-300 hover:text-white font-medium p-2">Upload</a>
            <a href="/#features" (click)="mobileMenuOpen = false" class="text-slate-300 hover:text-white font-medium p-2">Features</a>
            <a href="/#pricing" (click)="mobileMenuOpen = false" class="text-slate-300 hover:text-white font-medium p-2">Pricing</a>
          </nav>
        </div>
      }

      <main class="flex-1 relative z-10 pt-20">
        <router-outlet />
      </main>

      <footer class="relative z-10 bg-background-darker/80 border-t border-white/5 mt-auto backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div class="col-span-2 md:col-span-1">
              <div class="text-2xl font-display tracking-widest text-white mb-4">SENDIFY</div>
              <p class="text-sm text-slate-400 font-light max-w-xs">
                Modern file transfers designed for creators, teams, and high-performance workflows.
              </p>
            </div>
            <div>
              <h4 class="text-xs font-mono text-primary-cyan uppercase tracking-wider mb-4">Product</h4>
              <ul class="space-y-3 font-light text-sm">
                <li><a routerLink="/upload" class="text-slate-400 hover:text-white transition-colors">Upload</a></li>
                <li><a href="/#features" class="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/#pricing" class="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-mono text-primary-cyan uppercase tracking-wider mb-4">Legal</h4>
              <ul class="space-y-3 font-light text-sm">
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-xs font-mono text-primary-cyan uppercase tracking-wider mb-4">Connect</h4>
              <ul class="space-y-3 font-light text-sm">
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div class="pt-8 border-t border-white/5 text-center">
            <p class="text-xs text-slate-500 font-mono">
              &copy; {{ year }} Sendify Inc. All rights reserved.
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
