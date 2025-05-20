// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   standalone: true,
//   selector: 'app-login',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';

//   login() {
//     console.log('Username:', this.username);
//     console.log('Password:', this.password);
//     // Add login logic here
//   }
// }


import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor',
  standalone: true,  // Mark this as a standalone component
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent {
  // For now, no logic is needed
}
