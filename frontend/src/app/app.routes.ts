import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'customer-login', loadComponent: () => import('./customer/customer.component').then(m => m.LoginComponent) },
  // { path: 'customer-login', loadComponent: () => import('./customer-login/customer-login.component').then(m => m.LoginComponent) },
  { path: 'vendor-login', loadComponent: () => import('./vendor/vendor.component').then(m => m.VendorComponent) },
  { path: 'employee-login', loadComponent: () => import('./employee/employee.component').then(m => m.EmployeeComponent) },

  { path: 'accounts', loadComponent: () => import('./pages/accounts/accounts.component').then(m => m.AccountsComponent) },
  { path: 'customer-dashboard', loadComponent: () => import('./pages/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
  { path: 'financial-sheet', loadComponent: () => import('./pages/financial-sheet/financial-sheet.component').then(m => m.FinancialSheetComponent) },
  { path: 'logout', loadComponent: () => import('./pages/logout/logout.component').then(m => m.LogoutComponent) },

];
