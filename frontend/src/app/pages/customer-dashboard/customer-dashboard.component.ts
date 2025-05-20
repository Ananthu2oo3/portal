// // import { Component } from '@angular/core';
// // import { RouterModule } from '@angular/router';

// // @Component({
// //   selector: 'app-customer-dashboard',
// //   standalone: true,
// //   imports: [RouterModule],
// //   templateUrl: './customer-dashboard.component.html',
// //   styleUrls: ['./customer-dashboard.component.css']
// // })
// // export class CustomerDashboardComponent {
// //   hover = false;
// // }


// import { Component, HostListener } from '@angular/core';
// import { Router } from '@angular/router';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-customer-dashboard',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './customer-dashboard.component.html',
//   styleUrls: ['./customer-dashboard.component.css']
// })
// export class CustomerDashboardComponent {
//   hover = false;
//   isMobileScreen = false;

//   constructor(private router: Router) {
//     this.checkScreenSize();
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     this.checkScreenSize();
//   }

//   checkScreenSize() {
//     this.isMobileScreen = window.innerWidth <= 768;
//   }

//   logout() {
//     // You can clear session/local storage here too
//     alert('Logged out!');
//     this.router.navigate(['/customer-login']);
//   }
// }

// import { CommonModule } from '@angular/common';
// import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
// import { Router } from '@angular/router';
// import { RouterModule } from '@angular/router';
// import { isPlatformBrowser } from '@angular/common';

// @Component({
//   selector: 'app-customer-dashboard',
//   standalone: true,
//   imports: [RouterModule, CommonModule],  // Add CommonModule here
//   templateUrl: './customer-dashboard.component.html',
//   styleUrls: ['./customer-dashboard.component.css']
// })
// export class CustomerDashboardComponent {
//   hover = false;
//   isMobileScreen = false;

//   private isBrowser: boolean;

//   constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (this.isBrowser) {
//       this.checkScreenSize();
//     }
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     if (this.isBrowser) {
//       this.checkScreenSize();
//     }
//   }

//   checkScreenSize() {
//     this.isMobileScreen = window.innerWidth <= 768;
//   }

//   logout() {
//     alert('Logged out!');
//     this.router.navigate(['/customer-login']);
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent {
  isCollapsed = false;
  isCreateOpen = false;
  isTodoOpen = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(type: string) {
    if (type === 'create') this.isCreateOpen = !this.isCreateOpen;
    if (type === 'todo') this.isTodoOpen = !this.isTodoOpen;
  }
}
