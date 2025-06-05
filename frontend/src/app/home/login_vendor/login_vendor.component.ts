import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login_vendor',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login_vendor.component.html',
  styleUrls: ['./login_vendor.component.css']
})
export class VendorLoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.loading = true;
    this.message = '';

    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);

    this.http.get<any>('http://localhost:3000/api/vendor-login', { params }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'SUCCESS') {
          localStorage.setItem('username', this.username);
          this.message = `✅ Login successful! Vendor ID: ${response.data.vendorId}`;
          this.router.navigate(['/vendor-dashboard']);
        } else {
          this.message = '❌ Login failed!';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = '❌ Login failed! Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
