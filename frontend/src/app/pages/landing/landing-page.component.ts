import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="relative font-sans pt-10">

      <!-- 1. Hero Section -->
      <section class="relative z-10 min-h-screen flex items-center pt-20" id="hero">
        <div class="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div class="hero-content flex flex-col items-start">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-cyan mb-6 hero-badge">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-cyan opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-cyan"></span>
              </span>
              Sendify 2.0 is now live
            </div>
            <h1 class="heading-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mb-6 hero-title">
              SEND FILES AT<br/>
              <span class="text-gradient">THE SPEED</span><br/>
              OF IDEAS
            </h1>
            <p class="text-lg md:text-xl text-slate-400 max-w-lg mb-10 hero-desc font-light">
              Modern file transfers designed for creators, teams, and high-performance workflows. Experience the next generation of file sharing.
            </p>
            <div class="flex flex-wrap gap-4 hero-cta">
              <button class="btn-primary text-lg px-8 py-4">Start Free Trial</button>
              <button class="btn-secondary text-lg px-8 py-4 group">
                Watch Demo
                <svg class="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
          <div class="hero-visual relative h-[600px] w-full hidden lg:block" style="perspective: 1000px;">
            <!-- Abstract cinematic visual -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-full max-w-md aspect-[3/4] glass-panel p-6 relative shadow-2xl transition-transform duration-700 floating-card z-20" style="transform: rotateY(-15deg) rotateX(10deg);">
                <div class="w-full h-full border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden bg-background-dark/50">
                  <div class="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <div class="h-full bg-gradient-to-r from-primary-cyan via-primary-blue to-primary-violet w-2/3 animate-pulse"></div>
                  </div>
                  <div class="flex justify-between items-center mb-8">
                    <div class="w-12 h-12 rounded-xl bg-primary-blue/20 flex items-center justify-center">
                      <svg class="w-6 h-6 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    </div>
                    <div class="text-xs text-slate-400 font-mono">Transferring... 68%</div>
                  </div>
                  <div class="space-y-4 flex-grow">
                    <div class="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div class="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">RAW</div>
                      <div class="flex-grow">
                        <div class="h-2 w-24 bg-white/20 rounded mb-2"></div>
                        <div class="h-1 w-16 bg-white/10 rounded"></div>
                      </div>
                      <div class="text-xs text-slate-400">4.2 GB</div>
                    </div>
                    <div class="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 relative overflow-hidden">
                      <div class="absolute inset-0 bg-primary-blue/10 w-1/2"></div>
                      <div class="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold relative z-10">MP4</div>
                      <div class="flex-grow relative z-10">
                        <div class="h-2 w-32 bg-white/20 rounded mb-2"></div>
                        <div class="h-1 w-20 bg-white/10 rounded"></div>
                      </div>
                      <div class="text-xs text-slate-400 relative z-10">1.8 GB</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Transfer beams -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-10 pointer-events-none">
                <div class="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-cyan to-transparent opacity-50"></div>
                <div class="absolute top-2/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-70"></div>
                <div class="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-violet to-transparent opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Trust / Metrics Section -->
      <section class="relative z-10 py-24 border-y border-white/5 bg-white/[0.02]" id="metrics">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div class="metric-item">
              <div class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 counter" data-target="250">0</div>
              <div class="text-sm text-primary-cyan font-mono tracking-wider uppercase">Million+ Files</div>
            </div>
            <div class="metric-item">
              <div class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2"><span class="counter" data-target="99">0</span>.99%</div>
              <div class="text-sm text-primary-blue font-mono tracking-wider uppercase">Uptime</div>
            </div>
            <div class="metric-item">
              <div class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 counter" data-target="150">0</div>
              <div class="text-sm text-primary-violet font-mono tracking-wider uppercase">Countries</div>
            </div>
            <div class="metric-item">
              <div class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2"><span class="counter" data-target="10">0</span>x</div>
              <div class="text-sm text-primary-cyan font-mono tracking-wider uppercase">Faster Delivery</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Interactive Demo Section -->
      <section class="relative z-10 py-32 min-h-screen flex items-center" id="demo">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16 demo-header">
            <h2 class="heading-display text-5xl md:text-7xl mb-6">FEEL THE <span class="text-gradient">POWER</span></h2>
            <p class="text-slate-400 max-w-2xl mx-auto text-lg">Drop your files and watch our AI-optimized infrastructure instantly compress, encrypt, and deliver them anywhere in the world.</p>
          </div>
          
          <div class="max-w-4xl mx-auto glass-panel p-2 md:p-8 relative demo-container h-[400px] md:h-[500px] flex items-center justify-center">
            <!-- Demo Interactive Box -->
            <div class="w-full h-full border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary-cyan/50 transition-colors duration-500 cursor-pointer demo-dropzone bg-background-dark/30">
              <div class="absolute inset-0 bg-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="z-10 flex flex-col items-center demo-idle-state">
                <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-10 h-10 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <h3 class="text-2xl font-display tracking-wide mb-2 text-white">Click or Drop Files Here</h3>
                <p class="text-slate-400 font-mono text-sm">Experience the speed instantly</p>
              </div>
              
              <!-- Animation Layers (Hidden initially) -->
              <div class="absolute inset-0 hidden demo-active-state flex-col items-center justify-center bg-background-dark/80 backdrop-blur-sm z-20">
                <div class="w-full max-w-md px-6">
                   <div class="flex justify-between text-sm font-mono text-primary-cyan mb-3">
                     <span class="demo-status-text">Optimizing & Encrypting payload...</span>
                     <span class="demo-progress-text text-white">0%</span>
                   </div>
                   <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div class="h-full bg-gradient-to-r from-primary-cyan to-primary-violet w-0 rounded-full demo-progress-bar shadow-[0_0_10px_#22d3ee]"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Features Section -->
      <section class="relative z-10 py-32" id="features">
        <div class="container mx-auto px-6">
          <h2 class="heading-display text-5xl md:text-7xl mb-24 text-center">BEYOND <span class="text-slate-500">ORDINARY</span></h2>
          
          <div class="space-y-32">
            <!-- Feature 1 -->
            <div class="grid md:grid-cols-2 gap-12 items-center feature-row">
              <div class="order-2 md:order-1 glass-panel aspect-square md:aspect-[4/3] relative overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-br from-primary-violet/20 to-transparent opacity-50"></div>
                <!-- Visual -->
                <div class="absolute inset-0 flex items-center justify-center">
                   <div class="w-32 h-32 rounded-full border border-primary-violet/50 relative flex items-center justify-center animate-spin-slow">
                     <div class="absolute w-full h-full border-t-2 border-primary-violet rounded-full"></div>
                     <div class="w-24 h-24 rounded-full border border-primary-blue/50 absolute flex items-center justify-center" style="animation-direction: reverse;">
                       <div class="absolute w-full h-full border-b-2 border-primary-blue rounded-full"></div>
                     </div>
                   </div>
                   <svg class="w-12 h-12 text-white absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
              </div>
              <div class="order-1 md:order-2">
                <div class="text-primary-violet font-mono text-sm mb-4 tracking-widest uppercase">Military Grade</div>
                <h3 class="heading-display text-4xl md:text-5xl mb-6 text-white">Zero-Knowledge Encryption</h3>
                <p class="text-slate-400 text-lg leading-relaxed font-light">Your files are encrypted before they leave your device. Only you and your recipient hold the keys. We couldn't see your files even if we wanted to.</p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="grid md:grid-cols-2 gap-12 items-center feature-row">
              <div>
                <div class="text-primary-cyan font-mono text-sm mb-4 tracking-widest uppercase">AI-Powered</div>
                <h3 class="heading-display text-4xl md:text-5xl mb-6 text-white">Smart Network Optimization</h3>
                <p class="text-slate-400 text-lg leading-relaxed font-light">Our AI analyzes global network traffic in real-time to route your files through the fastest possible path, bypassing congestion and reducing transfer times by up to 60%.</p>
              </div>
              <div class="glass-panel aspect-square md:aspect-[4/3] relative overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-bl from-primary-cyan/20 to-transparent opacity-50"></div>
                <!-- Visual -->
                <div class="absolute inset-0">
                   <!-- Abstract network nodes -->
                   <div class="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-cyan rounded-full shadow-[0_0_15px_#22d3ee]"></div>
                   <div class="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary-blue rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                   <div class="absolute top-1/2 right-1/3 w-2 h-2 bg-white rounded-full"></div>
                   <!-- Animated connection line -->
                   <svg class="absolute inset-0 w-full h-full" style="filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.5));">
                     <path d="M 25% 25% Q 50% 50% 75% 66%" fill="none" stroke="url(#cyan-grad)" stroke-width="2" stroke-dasharray="100" stroke-dashoffset="0" class="animate-[dash_3s_linear_infinite]" />
                     <defs>
                       <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stop-color="#22d3ee" stop-opacity="0" />
                         <stop offset="50%" stop-color="#22d3ee" />
                         <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
                       </linearGradient>
                     </defs>
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Animated Workflow Section -->
      <section class="relative z-10 py-32 bg-background-darker border-y border-white/5" id="workflow">
        <div class="container mx-auto px-6">
          <div class="text-center mb-24">
            <h2 class="heading-display text-5xl md:text-7xl mb-6">THE <span class="text-gradient">WORKFLOW</span></h2>
            <p class="text-slate-400">A seamless process from your device to theirs.</p>
          </div>

          <div class="max-w-5xl mx-auto relative workflow-container py-10">
            <!-- Connecting line -->
            <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2">
              <div class="w-full bg-gradient-to-b from-primary-cyan via-primary-blue to-primary-violet workflow-progress-line" style="height: 0%;"></div>
            </div>

            <div class="space-y-24 relative z-10">
              <!-- Step 1 -->
              <div class="workflow-step relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div class="md:text-right md:pr-16 pl-20 md:pl-0">
                  <h4 class="text-2xl font-display tracking-wide mb-2 text-white">1. Select & Drop</h4>
                  <p class="text-slate-400 font-light">Drag massive folders or files straight into the browser. No limits on size.</p>
                </div>
                <div class="absolute left-[28px] md:left-1/2 w-4 h-4 bg-background-dark border-2 border-primary-cyan rounded-full md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_15px_#22d3ee]"></div>
                <div class="hidden md:block pl-16">
                   <div class="h-32 rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                     <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>
                     <div><div class="h-2 w-24 bg-white/20 rounded mb-2"></div><div class="h-2 w-16 bg-white/10 rounded"></div></div>
                   </div>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="workflow-step relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div class="hidden md:block md:text-right md:pr-16">
                   <div class="h-32 rounded-xl border border-white/10 bg-white/5 p-4 relative overflow-hidden flex items-center justify-center">
                      <div class="text-primary-blue font-mono text-sm animate-pulse">Encrypting payload...</div>
                      <div class="absolute bottom-0 left-0 h-1 bg-primary-blue w-full shadow-[0_0_10px_#3b82f6]"></div>
                   </div>
                </div>
                <div class="absolute left-[28px] md:left-1/2 w-4 h-4 bg-background-dark border-2 border-primary-blue rounded-full md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_15px_#3b82f6]"></div>
                <div class="pl-20 md:pl-16">
                  <h4 class="text-2xl font-display tracking-wide mb-2 text-white">2. Client-Side Encryption</h4>
                  <p class="text-slate-400 font-light">Data is encrypted locally using AES-256 before a single byte leaves your machine.</p>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="workflow-step relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div class="md:text-right md:pr-16 pl-20 md:pl-0">
                  <h4 class="text-2xl font-display tracking-wide mb-2 text-white">3. Instant Global Delivery</h4>
                  <p class="text-slate-400 font-light">Files propagate through our edge network, making them instantly available to the recipient anywhere.</p>
                </div>
                <div class="absolute left-[28px] md:left-1/2 w-4 h-4 bg-background-dark border-2 border-primary-violet rounded-full md:-translate-x-1/2 mt-1 md:mt-0 shadow-[0_0_15px_#8b5cf6]"></div>
                <div class="hidden md:block pl-16">
                   <div class="h-32 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden flex items-center justify-center">
                     <svg class="w-10 h-10 text-primary-violet animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Pricing Section -->
      <section class="relative z-10 py-32" id="pricing">
        <div class="container mx-auto px-6">
          <div class="text-center mb-24">
            <h2 class="heading-display text-5xl md:text-7xl mb-6">SIMPLE <span class="text-gradient-subtle">PRICING</span></h2>
            <p class="text-slate-400">Everything you need. No hidden fees.</p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Free Tier -->
            <div class="glass-panel p-8 md:p-12 pricing-card transition-all duration-300 hover:border-white/20 flex flex-col">
              <h3 class="text-2xl font-display tracking-widest text-slate-300 mb-2">CREATOR</h3>
              <div class="text-5xl font-light mb-8">$0<span class="text-lg text-slate-500 font-sans">/mo</span></div>
              <ul class="space-y-4 mb-10 text-slate-400 font-light text-sm flex-grow">
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Up to 5GB per transfer</li>
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Files available for 7 days</li>
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> End-to-end encryption</li>
              </ul>
              <button class="btn-secondary w-full py-4 text-sm tracking-wide">Get Started Free</button>
            </div>

            <!-- Pro Tier -->
            <div class="glass-panel p-8 md:p-12 relative pricing-card transform md:-translate-y-4 shadow-[0_20px_50px_rgba(34,211,238,0.1)] border-primary-cyan/30 flex flex-col">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-primary-cyan to-primary-blue rounded-full text-xs font-bold text-white tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.5)]">PRO</div>
              <h3 class="text-2xl font-display tracking-widest text-white mb-2">STUDIO</h3>
              <div class="text-5xl font-light mb-8 text-white">$19<span class="text-lg text-slate-500 font-sans">/mo</span></div>
              <ul class="space-y-4 mb-10 text-slate-300 font-light text-sm flex-grow">
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> <span class="font-medium text-white">250GB</span> per transfer</li>
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Never expire</li>
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Custom branding</li>
                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-primary-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> AI Network Optimization</li>
              </ul>
              <button class="btn-primary w-full py-4 text-sm tracking-wide">Start 14-Day Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. FAQ Section -->
      <section class="relative z-10 py-32 bg-background-darker/50" id="faq">
        <div class="container mx-auto px-6 max-w-3xl">
          <h2 class="heading-display text-4xl md:text-5xl mb-16 text-center">COMMON QUESTIONS</h2>
          <div class="space-y-4">
            <div class="glass-panel p-6 faq-item group cursor-pointer transition-colors hover:bg-white/10">
              <div class="flex justify-between items-center">
                <h4 class="text-lg font-medium text-white group-hover:text-primary-cyan transition-colors">Is there a limit on file size?</h4>
                <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <p class="text-slate-400 mt-4 text-sm font-light hidden faq-content">Free users can send up to 5GB per transfer. Studio users can send up to 250GB at once, making it perfect for 8K video files or massive project folders.</p>
            </div>
            <div class="glass-panel p-6 faq-item group cursor-pointer transition-colors hover:bg-white/10">
              <div class="flex justify-between items-center">
                <h4 class="text-lg font-medium text-white group-hover:text-primary-cyan transition-colors">How secure are my files?</h4>
                <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <p class="text-slate-400 mt-4 text-sm font-light hidden faq-content">We use AES-256 client-side encryption. The encryption key is generated in your browser and appended to the sharing URL. We never see your files or your keys.</p>
            </div>
            <div class="glass-panel p-6 faq-item group cursor-pointer transition-colors hover:bg-white/10">
              <div class="flex justify-between items-center">
                <h4 class="text-lg font-medium text-white group-hover:text-primary-cyan transition-colors">Do recipients need an account?</h4>
                <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <p class="text-slate-400 mt-4 text-sm font-light hidden faq-content">No. Anyone with the link can download the files instantly without creating an account or downloading any app.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. CTA Section -->
      <section class="relative z-10 py-40 overflow-hidden" id="cta">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary-violet/10 pointer-events-none"></div>
        <div class="container mx-auto px-6 text-center relative z-10">
          <h2 class="heading-display text-6xl sm:text-8xl md:text-9xl mb-8 cta-title">
            TRANSFER <span class="text-transparent" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">ANYTHING.</span><br/>
            <span class="text-gradient">ANYWHERE.</span><br/>
            INSTANTLY.
          </h2>
          <div class="flex justify-center mt-12 cta-button">
            <button class="btn-primary text-xl px-12 py-6 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform duration-300 group">
              Start Free Trial
              <svg class="w-6 h-6 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    @keyframes dash {
      to { stroke-dashoffset: -100; }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
  `]
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    // Give a small timeout for the DOM to be fully ready
    setTimeout(() => {
      this.initHeroAnimations();
      this.initScrollAnimations();
      this.initInteractiveDemo();
      this.initFAQ();
    }, 100);
  }

  private initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, delay: 0.2 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.floating-card', { 
        x: 100, y: 50, rotationY: 25, rotationX: 15, opacity: 0, duration: 1.2, ease: 'expo.out' 
      }, '-=1');

    gsap.to('.floating-card', {
      y: -15,
      rotationY: -10,
      rotationX: 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  private initScrollAnimations() {
    // Metrics counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      ScrollTrigger.create({
        trigger: '#metrics',
        start: 'top 80%',
        onEnter: () => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out'
          });
        },
        once: true
      });
    });

    // Features Section
    const featureRows = document.querySelectorAll('.feature-row');
    featureRows.forEach((row, i) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Workflow lines
    gsap.to('.workflow-progress-line', {
      scrollTrigger: {
        trigger: '.workflow-container',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1
      },
      height: '100%',
      ease: 'none'
    });

    const workflowSteps = document.querySelectorAll('.workflow-step');
    workflowSteps.forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
        },
        x: i % 2 === 0 ? -30 : 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Pricing Cards
    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '#pricing',
        start: 'top 70%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Final CTA
    gsap.from('.cta-title', {
      scrollTrigger: {
        trigger: '#cta',
        start: 'top 70%'
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'expo.out'
    });
    gsap.from('.cta-button', {
      scrollTrigger: {
        trigger: '#cta',
        start: 'top 80%'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.3
    });
  }

  private initInteractiveDemo() {
    const dropzone = document.querySelector('.demo-dropzone');
    const idleState = document.querySelector('.demo-idle-state');
    const activeState = document.querySelector('.demo-active-state');
    const progressBar = document.querySelector('.demo-progress-bar');
    const progressText = document.querySelector('.demo-progress-text');
    const statusText = document.querySelector('.demo-status-text');

    if (dropzone && idleState && activeState && progressBar && progressText && statusText) {
      dropzone.addEventListener('click', () => {
        if (!idleState.classList.contains('hidden')) {
            // Hide idle, show active
            idleState.classList.add('hidden');
            activeState.classList.remove('hidden');
            activeState.classList.add('flex');
            
            statusText.innerHTML = 'Optimizing & Encrypting payload...';

            const tl = gsap.timeline();
            
            tl.to(progressBar, {
              width: '100%',
              duration: 2.5,
              ease: 'power1.inOut',
              onUpdate: function(this: any) {
                progressText.innerHTML = Math.round(this['progress']() * 100) + '%';
              }
            })
            .call(() => {
                statusText.innerHTML = 'Securing global route...';
            }, [], "-=1")
            .to(statusText, {
              innerHTML: 'Transfer Complete!',
              duration: 0.1
            })
            .to(progressText, {
              innerHTML: 'Link Ready',
              duration: 0.1
            }, "<")
            .to(progressBar, {
              backgroundColor: '#10b981', // Success green
              duration: 0.3
            })
            .to({}, { duration: 2.5 }) // Wait 2.5 seconds
            .call(() => {
               // Reset
               activeState.classList.add('hidden');
               activeState.classList.remove('flex');
               idleState.classList.remove('hidden');
               gsap.set(progressBar, { width: '0%', backgroundColor: '' });
               progressText.innerHTML = '0%';
            });
        }
      });
    }
  }

  private initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('click', () => {
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('svg');
        if (content) {
          if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            gsap.from(content, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
            if (icon) gsap.to(icon, { rotation: 180, duration: 0.3 });
          } else {
            content.classList.add('hidden');
            if (icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
          }
        }
      });
    });
  }
}
