import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-vendor-profile',
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css'] 
})
export class VendorProfileComponent implements OnInit {
  private http = inject(HttpClient);
  vendorData: any = null;
  vendorDataKeys: string[] = [];
  error: string = '';
  loading = false;

  ngOnInit() {
    this.fetchVendorProfile();
  }

  fetchVendorProfile() {
    this.loading = true;
    const vendorId = localStorage.getItem('username');

    if (!vendorId) {
      this.error = 'Vendor ID not found in localStorage';
      this.loading = false;
      return;
    }

    this.http.post<any>('http://localhost:3000/api/vendor-profile', { username: vendorId }).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          this.vendorData = res.data;
          this.vendorDataKeys = Object.keys(this.vendorData);
        } else {
          this.error = 'Failed to fetch vendor profile';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('HTTP error:', err);
        this.error = 'Server error';
        this.loading = false;
      }
    });
  }
}
