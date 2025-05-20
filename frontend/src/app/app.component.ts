// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { EmployeeComponent } from "./employee/employee.component";
// import {VendorComponent} from "./vendor/vendor.component";
// import { CustomerComponent } from './customer/customer.component';
// import { HomeComponent } from "./home/home.component";

// @Component({
//   selector: 'app-root',
//   // imports: [RouterOutlet, LoginComponent],
//   // imports: [RouterOutlet, VendorComponent],
//   imports: [RouterOutlet, HomeComponent, EmployeeComponent, VendorComponent, CustomerComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'customer_portal';
// }


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { HomeComponent } from './home/home.component';

// bootstrapApplication(HomeComponent, {
//   providers: [provideRouter(routes)]
// });


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
