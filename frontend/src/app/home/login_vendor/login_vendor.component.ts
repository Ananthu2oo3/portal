// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

// @Component({
//   standalone: true,
//   selector: 'app-login_vendor',
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './login_vendor.component.html',
//   styleUrls: ['./login_vendor.component.css']
// })
// export class VendorLoginComponent {
//   username: string = '';
//   password: string = '';
//   message: string = '';
//   loading: boolean = false;

//   constructor(private http: HttpClient, private router: Router) {}

//   login() {
//     this.loading = true;
//     this.message = '';

//   const body = {
//     username: this.username,
//     password: this.password
//   };

//     this.http.post<any>('http://localhost:3000/api/vendor-login', body).subscribe({
//       next: (response) => {
//         this.loading = false;
//         if (response.status === 'SUCCESS') {
//         const paddedUsername = this.username.padStart(10, '0'); 
//         localStorage.setItem('username', paddedUsername);

//           this.router.navigate(['/vendor-dashboard']);
//         } else {
//           this.message = '❌ Login failed!';
//         }
//       },
//       error: (err) => {
//         this.loading = false;
//         this.message = '❌ Login failed! Please try again.';
//         console.error('Login error:', err);
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login-vendor',
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
    if (!this.username || !this.password) {
      this.message = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.message = '';

    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/api/vendor-login', body).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.status === 'SUCCESS' && response.token) {
          // ✅ Store JWT token for Auth Interceptor
          localStorage.setItem('token', response.token);

          // Optionally store padded username if needed
          const paddedUsername = this.username.padStart(10, '0');
          localStorage.setItem('username', paddedUsername);

          this.message = '✅ Login successful!';
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

