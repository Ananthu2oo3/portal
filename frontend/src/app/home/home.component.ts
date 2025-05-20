// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent {
//   navigateTo(path: string) {
//     window.location.href = '/' + path;
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  navigateTo(path: string) {
    // Angular route navigation
    window.location.href = '/' + path;
  }
}
