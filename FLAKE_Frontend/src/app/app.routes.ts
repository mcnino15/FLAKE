import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main-page/main.routes').then((m) => m.routes),
    canActivateChild: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
