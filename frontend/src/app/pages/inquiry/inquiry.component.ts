// import { Component, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

// @Component({
//   selector: 'app-accounts',
//   standalone: true,
//   imports: [CommonModule, SidebarNavComponent],
//   templateUrl: './inquiry.component.html',
//   styleUrl: './inquiry.component.css'
// })
// export class InquirdData {
//   private http = inject(HttpClient);

//   customerData: any[] = [];
//   fieldKeys: string[] = [];
//   error: string = '';
//   loading = false;

//   ngOnInit() {
//     console.log('📦 Component initialized');
//     this.fetchCustomerProfile();
//   }

//   fetchCustomerProfile() {
//     this.loading = true;
//     const username = localStorage.getItem('username');

//     if (!username) {
//       this.error = 'Username not found in local storage';
//       this.loading = false;
//       return;
//     }

//     this.http.post<any>('http://localhost:3000/api/inquiry-data', { username }).subscribe({
//       next: (res) => {
//         if (res.status === 'S' && Array.isArray(res.data)) {
//           this.customerData = res.data;
//           this.fieldKeys = Object.keys(res.data[0] || {});
//         } else {
//           this.error = 'No valid data received';
//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Server error';
//         this.loading = false;
//       }
//     });
//   }
// }


import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.css'
})
export class InquirdData {
  private http = inject(HttpClient);

  customerData: any[] = [];
  fieldKeys: string[] = [];
  error: string = '';
  loading = false;

  ngOnInit() {
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

    this.http.post<any>('http://localhost:3000/api/inquiry-data', { username }).subscribe({
      next: (res) => {
        if (res.status === 'S' && Array.isArray(res.data)) {
          this.customerData = res.data;
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
