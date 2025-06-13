import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,  
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent { 

  username = '';
  password = '';
  statusMessage = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.statusMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Logging in...';

    this.http.post<any>('http://localhost:3000/api/employee-login', {
      username: this.username,
      password: this.password

    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'SUCCESS') {
          localStorage.setItem('username', this.username);
          this.statusMessage = 'Login successful!';
          this.router.navigate(['/employee-profile']);

        } else {
          this.statusMessage = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.statusMessage = 'Invalid credentials';
        } else if (err.error?.message) {
          this.statusMessage = err.error.message;
        } else {
          this.statusMessage = 'Login failed. Please try again later.';
        }
        console.error('Login error:', err);
      }
    });
  }
}