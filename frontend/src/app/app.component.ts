import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center gap-3 group cursor-pointer">
              <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span class="font-semibold text-lg text-slate-900">FileShare</span>
            </a>
            <nav class="flex items-center gap-2">
              <a href="/" class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 cursor-pointer">
                Upload
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-white border-t border-slate-200/80 mt-auto">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-slate-500">
              Secure file sharing made simple
            </p>
            <div class="flex items-center gap-6">
              <a href="#" class="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">Privacy</a>
              <a href="#" class="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">Terms</a>
              <span class="text-sm text-slate-400">2024</span>
            </div>
          </div>
        </div>
      </footer>

      <app-toast />
    </div>
  `,
})
export class AppComponent {}
