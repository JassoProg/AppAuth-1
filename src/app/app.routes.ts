import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ProfileComponent } from './auth/profile/profile';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized';
import { RoleManagementComponent } from './components/role-management/role-management';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { 
    path: 'auth/profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/roles',
    component: RoleManagementComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] }
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
