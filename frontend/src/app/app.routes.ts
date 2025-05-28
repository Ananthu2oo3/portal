import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'customer-login', loadComponent: () => import('./login_customer/customer.component').then(m => m.LoginComponent) },
  { path: 'vendor-login', loadComponent: () => import('./login_vendor/vendor.component').then(m => m.VendorComponent) },
  { path: 'employee-login', loadComponent: () => import('./login_employee/employee.component').then(m => m.EmployeeComponent) },

  { path: 'accounts', loadComponent: () => import('./pages/accounts/accounts.component').then(m => m.AccountsComponent) },
  { path: 'customer-dashboard', loadComponent: () => import('./pages/customer_dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
  { path: 'financial-sheet', loadComponent: () => import('./pages/financial_dashboard/financial-sheet.component').then(m => m.FinancialSheetComponent) },

  { path: 'inquiry-data', loadComponent: () => import('./pages/customer_inquiry/inquiry.component').then(m => m.InquirdData) },
  { path: 'delivery-data', loadComponent: () => import('./pages/customer_delivery/delivery.component').then(m => m.DeliveryDataComponent) },
  { path: 'sales-order-data', loadComponent: () => import('./pages/customer_sale-order-data/sale-order-data.component').then(m => m.SaleOrderDataComponent) },


  { path: 'overall-sales', loadComponent: () => import('./pages/financial_overall_sales/finance-overall-sales.component').then(m => m.FinanceOverallSalesComponent) },
  { path: 'credit-debit-memo', loadComponent: () => import('./pages/financial_debit_memo/financial_debit_memo.component').then(m => m.CreditDebitMemoComponent) },
  { path: 'payment-aging', loadComponent: () => import('./pages/financial_payment_aging/financial-payment-aging.component').then(m => m.FinancialPaymentAgingComponent) },

];

