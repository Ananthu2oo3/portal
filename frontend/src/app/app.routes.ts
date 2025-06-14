import { Routes } from '@angular/router';
import { HomeComponent } from './home/home_page/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Home Routes

  { path: 'customer-login', loadComponent: () => import('./home/login_customer/customer.component').then(m => m.LoginComponent) },
  { path: 'vendor-login', loadComponent: () => import('./home/login_vendor/login_vendor.component').then(m => m.VendorLoginComponent) },
  { path: 'employee-login', loadComponent: () => import('./home/login_employee/employee.component').then(m => m.EmployeeComponent) },


  
  // Customer Routes

  { path: 'accounts', loadComponent: () => import('./customer/accounts/accounts.component').then(m => m.AccountsComponent) },
  { path: 'customer-dashboard', loadComponent: () => import('./customer/customer_dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
  { path: 'financial-sheet', loadComponent: () => import('./customer/financial_dashboard/financial-sheet.component').then(m => m.FinancialSheetComponent) },

  { path: 'inquiry-data', loadComponent: () => import('./customer/customer_inquiry/inquiry.component').then(m => m.InquirdData) },
  { path: 'delivery-data', loadComponent: () => import('./customer/customer_delivery/delivery.component').then(m => m.DeliveryDataComponent) },
  { path: 'sales-order-data', loadComponent: () => import('./customer/customer_sale-order-data/sale-order-data.component').then(m => m.SaleOrderDataComponent) },


  { path: 'overall-sales', loadComponent: () => import('./customer/financial_overall_sales/finance-overall-sales.component').then(m => m.FinanceOverallSalesComponent) },
  { path: 'credit-debit-memo', loadComponent: () => import('./customer/financial_debit_memo/financial_debit_memo.component').then(m => m.CreditDebitMemoComponent) },
  { path: 'payment-aging', loadComponent: () => import('./customer/financial_payment_aging/financial-payment-aging.component').then(m => m.FinancialPaymentAgingComponent) },
  { path: 'financial-invoice', loadComponent: () => import('./customer/financial-invoice/financial-invoice.component').then(m => m.FinancialInvoiceComponent) },

  
  
  // Vendor Routes

  { path: 'vendor-profile', loadComponent: () => import('./vendor/vendor-profile/vendor-profile.component').then(m => m.VendorProfileComponent) },
  { path: 'vendor-dashboard', loadComponent: () => import('./vendor/vendor-dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent) },
  { path: 'vendor-financial-sheet', loadComponent: () => import('./vendor/financial_dashboard/financial-sheet.component').then(m => m.VendorFinancialSheetComponent) },
  
  { path: 'request-quotation', loadComponent: () => import('./vendor/vendor-quotation-request/vendor-quotation-request.component').then(m => m.VendorQuotationRequestComponent) },
  { path: 'purchase-order', loadComponent: () => import('./vendor/vendor-purchase-order/vendor-purchase-order.component').then(m => m.VendorPurchaseOrderComponent) },
  { path: 'goods-receipt', loadComponent: () => import('./vendor/vendor-goods-receipt/vendor-goods-receipt.component').then(m => m.VendorQuotationRequestComponent) },

  { path: 'vendor-credit-debit-memo', loadComponent: () => import('./vendor/financial-credit_debit/financial-credit_debit.component').then(m => m.FinancialCreditDebitComponent) },
  { path: 'vendor-payment-aging', loadComponent: () => import('./vendor/financial-payment-aging/financial-payment-aging.component').then(m => m.FinancialPaymentAgingComponent) },
  { path: 'vendor-invoice', loadComponent: () => import('./vendor/financial-vendor-innvoice/financial-vendor-innvoice.component').then(m => m.FinancialVendorInnvoiceComponent) },


  
  // Employee Routes

  {  path: 'employee-profile', loadComponent: () => import('./employee/employee-profile/employee-profile.component').then(m => m.EmployeeProfileComponent) },
  {  path: 'employee-leave-request', loadComponent: () => import('./employee/employee-leave-request/employee-leave-request.component').then(m => m.EmployeeLeaveRequestComponent) },
  {  path: 'employee-payslip', loadComponent: () => import('./employee/employee-pay-slip/employee-pay-slip.component').then(m => m.EmployeePaySlipComponent) }
];
  
