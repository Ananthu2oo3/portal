import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-finance-overall-sales',
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './finance-overall-sales.component.html',
  styleUrl: './finance-overall-sales.component.css'
})
export class FinanceOverallSalesComponent {

  private http = inject(HttpClient);

  salesOrderList: any[] = [];
  fieldKeys: string[] = [];
  error: string = '';
  loading = false;

  ngOnInit() {
    this.fetchSalesOrderData();
  }

  fetchSalesOrderData() {
    this.loading = true;
    const username = localStorage.getItem('username');

    if (!username) {
      this.error = 'Username not found in local storage';
      this.loading = false;
      return;
    }

    this.http.post<any>('http://localhost:3000/api/overall-sales', { username }).subscribe({
      next: (res) => {
        if (res.status === 'S' && Array.isArray(res.data)) {
          this.salesOrderList = res.data;
          this.fieldKeys = Object.keys(res.data[0] || {});
        } else {
          this.error = 'No valid data received';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Server error';
        this.loading = false;
      }
    });
  }
}
