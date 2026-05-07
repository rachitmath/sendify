import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CardComponent],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent"></div>
      <div class="absolute top-1/4 -left-32 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 -right-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div class="text-center max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 animate-fade-in-up">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Now in public beta &middot; Free to use
          </div>

          <h1 class="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 animate-fade-in-up">
            File sharing
            <span class="text-gradient">reimagined</span>
            <br />for modern teams
          </h1>

          <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed">
            Send files securely with AI-powered encryption, smart expiry, and real-time tracking.
            No signup required. Built for speed and privacy.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <a routerLink="/upload">
              <app-button variant="gradient" size="lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                </svg>
                Start sending files
              </app-button>
            </a>
            <a href="#features">
              <app-button variant="secondary" size="lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Explore features
              </app-button>
            </a>
          </div>
        </div>

        <!-- Hero mockup -->
        <div class="mt-16 max-w-5xl mx-auto animate-fade-in-up">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-300/5 rounded-3xl blur-xl"></div>
            <div class="card-glass p-1 overflow-hidden shadow-2xl shadow-primary-500/10">
              <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-400"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div class="flex-1 flex justify-center">
                    <div class="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-slate-400 dark:text-slate-500 font-mono">
                      sendify.app
                    </div>
                  </div>
                </div>
                <div class="p-8 md:p-12 flex items-center justify-center min-h-[300px] bg-gradient-to-br from-primary-50/50 to-slate-50 dark:from-primary-950/20 dark:to-slate-900">
                  <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white dark:bg-slate-800 shadow-soft flex items-center justify-center">
                      <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                      </svg>
                    </div>
                    <p class="text-slate-400 dark:text-slate-500 text-sm font-mono">Drag & drop your files here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12 border-y border-slate-200/50 dark:border-slate-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          @for (stat of stats; track stat.label) {
            <div class="text-center">
              <p class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{{ stat.value }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 md:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-4">
            Features
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Everything you need to share files
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            No bloated tools, no complicated setup. Just fast, secure file sharing.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.title) {
            <app-card variant="hover" padding="md">
              <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                <div [innerHTML]="feature.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400"></div>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ feature.description }}</p>
            </app-card>
          }
        </div>
      </div>
    </section>

    <!-- Showcase -->
    <section class="py-20 md:py-28 bg-white dark:bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-4">
              Smart dashboard
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Track and manage your shares
            </h2>
            <p class="text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              See who downloaded your files, manage expiry dates, and revoke access anytime.
              Complete visibility into your shared content.
            </p>
            <ul class="space-y-3">
              @for (item of showcaseItems; track item) {
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                  <span class="text-sm text-slate-600 dark:text-slate-300">{{ item }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="card-glass p-1 overflow-hidden shadow-xl">
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6">
              @for (share of shares; track share.name) {
                <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer">
                  <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ share.name }}</p>
                    <p class="text-xs text-slate-500">{{ share.size }} &middot; {{ share.downloads }} downloads</p>
                  </div>
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">{{ share.status }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-20 md:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Built for modern workflows
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            Sendify adapts to the way you work, not the other way around.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          @for (benefit of benefits; track benefit.title) {
            <div class="flex gap-5 p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <div [innerHTML]="benefit.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400"></div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">{{ benefit.title }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ benefit.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-20 md:py-28 bg-white dark:bg-slate-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-4">
            Pricing
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            Start for free, upgrade when you need more.
          </p>

          <div class="inline-flex items-center gap-2 p-1 mt-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              (click)="yearly.set(false)"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
              [class.bg-white]="!yearly()"
              [class.text-slate-900]="!yearly()"
              [class.dark:bg-slate-700]="!yearly()"
              [class.dark:text-white]="!yearly()"
              [class.text-slate-500]="yearly()"
              [class.dark:text-slate-400]="yearly()"
            >
              Monthly
            </button>
            <button
              (click)="yearly.set(true)"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
              [class.bg-white]="yearly()"
              [class.text-slate-900]="yearly()"
              [class.dark:bg-slate-700]="yearly()"
              [class.dark:text-white]="yearly()"
              [class.text-slate-500]="!yearly()"
              [class.dark:text-slate-400]="!yearly()"
            >
              Yearly
              <span class="text-xs text-emerald-500 font-semibold ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          @for (plan of plans; track plan.name; let i = $index) {
            <app-card
              [variant]="plan.popular ? 'default' : 'hover'"
              [padding]="plan.popular ? 'md' : 'md'"
            >
              @if (plan.popular) {
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span class="inline-flex px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold shadow-sm">Most popular</span>
                </div>
              }
              <div class="relative">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ plan.name }}</h3>
                  @if (plan.name === 'Enterprise') {
                    <div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0112.574-3.977A60.46 60.46 0 0121.743 10.5M3.633 12.574A60.535 60.535 0 013 12.5m16.5 0v3.75a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V10.5"></path>
                      </svg>
                    </div>
                  }
                </div>
                <div class="mb-6">
                  <span class="text-4xl font-bold text-slate-900 dark:text-white">
                    @if (plan.price === 'Custom') {
                      {{ plan.price }}
                    } @else {
                      {{ yearly() ? '$' + plan.priceYearly : '$' + plan.price }}
                    }
                  </span>
                  @if (plan.price !== 'Custom') {
                    <span class="text-sm text-slate-500">/month</span>
                  }
                </div>
                <ul class="space-y-3 mb-8">
                  @for (feature of plan.features; track feature) {
                    <li class="flex items-start gap-3 text-sm">
                      <svg class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                      </svg>
                      <span class="text-slate-600 dark:text-slate-300">{{ feature }}</span>
                    </li>
                  }
                </ul>
                <a routerLink="/upload">
                  <app-button
                    [variant]="plan.popular ? 'gradient' : 'secondary'"
                    [fullWidth]="true"
                  >
                    {{ plan.cta }}
                  </app-button>
                </a>
              </div>
            </app-card>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 md:py-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Frequently asked questions
        </h2>
      </div>

      <div class="space-y-3">
        @for (faq of faqs; track faq.q) {
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-200">
            <button
              (click)="toggleFaq(faq)"
              class="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <span class="text-sm font-medium text-slate-900 dark:text-white pr-4">{{ faq.q }}</span>
              <svg
                class="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200"
                [class.rotate-180]="faq.open"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </button>
            @if (faq.open) {
              <div class="px-6 pb-4 bg-white dark:bg-slate-800/50 animate-fade-in">
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ faq.a }}</p>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 md:py-28 px-4">
      <div class="max-w-4xl mx-auto text-center relative">
        <div class="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent"></div>
        <div class="relative">
          <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
            Ready to simplify your file sharing?
          </h2>
          <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Join thousands of teams who trust Sendify. No credit card required.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/upload">
              <app-button variant="gradient" size="lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                </svg>
                Get started free
              </app-button>
            </a>
            <a href="#features">
              <app-button variant="secondary" size="lg">
                Learn more
              </app-button>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingPageComponent {
  yearly = signal(false);

  stats = [
    { value: '10K+', label: 'Files shared' },
    { value: '99.9%', label: 'Uptime' },
    { value: '256-bit', label: 'Encryption' },
    { value: '5GB', label: 'Max file size' },
  ];

  features = [
    {
      title: 'End-to-end encryption',
      description: 'Your files are encrypted in transit and at rest. Only intended recipients can access them.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>`,
    },
    {
      title: 'Smart expiry',
      description: 'Set automatic expiration for your shared files. Choose from 1 hour to 30 days, or pick a custom date.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
    },
    {
      title: 'Password protection',
      description: 'Add an extra layer of security with optional password protection for sensitive files.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>`,
    },
    {
      title: 'Large file support',
      description: 'Send files up to 5GB with our chunked upload system. No compression, no quality loss.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
      </svg>`,
    },
    {
      title: 'Download tracking',
      description: 'Monitor how many times your files have been downloaded and manage access in real time.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>`,
    },
    {
      title: 'Email notifications',
      description: 'Notify recipients automatically when you share files. Optional custom message included.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>`,
    },
  ];

  showcaseItems = [
    'Real-time download analytics',
    'One-click link revocation',
    'Automatic file cleanup on expiry',
    'Custom share URLs with your brand',
  ];

  shares = [
    { name: 'Q4 Report.pdf', size: '2.4 MB', downloads: 12, status: 'Active' },
    { name: 'Design Assets.zip', size: '156 MB', downloads: 8, status: 'Active' },
    { name: 'Meeting Notes.docx', size: '1.1 MB', downloads: 24, status: 'Expiring' },
    { name: 'Product Screenshots', size: '45 MB', downloads: 3, status: 'Active' },
  ];

  benefits = [
    {
      title: 'Boost team productivity',
      description: 'Share large files in seconds without IT tickets or VPN access. Your team stays focused on what matters.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>`,
    },
    {
      title: 'Automate security policies',
      description: 'Set expiration dates, password requirements, and download limits automatically based on your workflow.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>`,
    },
    {
      title: 'AI-powered assistance',
      description: 'Smart suggestions for expiry times, automatic file categorization, and intelligent recipient recommendations.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>`,
    },
    {
      title: 'Seamless collaboration',
      description: 'Share files with anyone, anywhere. No account needed on the recipient side — just a secure link.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>`,
    },
    {
      title: 'Enterprise-grade security',
      description: '256-bit AES encryption, SOC 2 compliance, and configurable retention policies for regulated industries.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>`,
    },
    {
      title: 'Scalable infrastructure',
      description: 'From a single file to millions — our infrastructure scales automatically. No downtime, no bottlenecks.',
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
      </svg>`,
    },
  ];

  plans = [
    {
      name: 'Starter',
      price: '0',
      priceYearly: '0',
      cta: 'Get started',
      popular: false,
      features: [
        'Up to 5GB per file',
        '7-day file expiry',
        'Basic encryption',
        'Email notifications',
        '1 concurrent upload',
      ],
    },
    {
      name: 'Pro',
      price: '12',
      priceYearly: '9',
      cta: 'Start free trial',
      popular: true,
      features: [
        'Up to 25GB per file',
        'Custom expiry dates',
        'Password protection',
        'Download tracking',
        '3 concurrent uploads',
        'Priority support',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      priceYearly: 'Custom',
      cta: 'Contact sales',
      popular: false,
      features: [
        'Unlimited file size',
        'Custom retention policies',
        'SSO & SAML',
        'Audit logs',
        'Dedicated support',
        'SLA guarantee',
      ],
    },
  ];

  faqs = [
    { q: 'Do recipients need an account to download files?', a: 'No! Recipients can download files without creating an account. They just need the secure link you share with them.', open: false },
    { q: 'How long do files stay available?', a: 'You control the expiry. Choose from 1 hour, 6 hours, 24 hours, 7 days, or 30 days. Pro and Enterprise plans support custom expiration dates.', open: false },
    { q: 'Is my data encrypted?', a: 'Yes. All files are encrypted in transit using TLS 1.3 and at rest using 256-bit AES encryption. We use industry-standard security practices.', open: false },
    { q: 'What is the maximum file size?', a: 'The free plan supports files up to 5GB. Pro supports up to 25GB, and Enterprise has no file size limit.', open: false },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel at any time. Your files will remain accessible until their expiry dates, and you won\'t be charged again.', open: false },
    { q: 'How does Sendify handle data privacy?', a: 'We never access your files. Files are encrypted and stored in secure S3 buckets. Automatic cleanup ensures files are deleted after expiry.', open: false },
  ];

  toggleFaq(faq: { open: boolean }): void {
    faq.open = !faq.open;
  }
}
