import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/upload/upload-page.component').then((m) => m.UploadPageComponent),
  },
  {
    path: 'download/:shareId',
    loadComponent: () =>
      import('./features/download/download-page.component').then((m) => m.DownloadPageComponent),
  },
  {
    path: 'share/:shareId',
    loadComponent: () =>
      import('./features/share/share-success.component').then((m) => m.ShareSuccessComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found.component').then((m) => m.NotFoundComponent),
  },
];
