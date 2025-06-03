import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-vendor-profile',
  // standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})

export class VendorProfileComponent implements OnInit{

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
    console.log('Fetching vendor profile...');

    const vendorId = '100001';  // Replace with actual logic if needed

    if (!vendorId) {
      this.error = 'Vendor ID not found';
      this.loading = false;
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/vendor-profile/`).subscribe({
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
