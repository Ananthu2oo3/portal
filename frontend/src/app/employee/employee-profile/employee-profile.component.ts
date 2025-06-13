import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent {

  private http = inject(HttpClient);

  customerData: any = null;
  customerDataKeys: string[] = [];
  error: string = '';
  loading = false;


  ngOnInit() {
    console.log('Component initialized');
    this.fetchCustomerProfile();
  }

  fetchCustomerProfile() {
  this.loading = true;

  const username = localStorage.getItem('username');

  if (!username) {
    this.error = 'Username not found in local storage';
    this.loading = false;
    return;
  }


  this.http.post<any>('http://localhost:3000/api/employee-profile', { username }).subscribe({
    next: (res) => {
      if (res.status === 'S') {
        this.customerData = res.data;
        this.customerDataKeys = Object.keys(this.customerData);

      } else {
        this.error = 'Failed to fetch customer profile';
      }
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Server error';
      this.loading = false;
    }
  });
}

}
