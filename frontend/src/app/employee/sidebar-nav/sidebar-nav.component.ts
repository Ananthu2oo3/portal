import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // ✅ Import RouterModule
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Add RouterModule here
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css'],
})
export class SidebarNavComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  logout() {
    localStorage.removeItem('username'); 
    this.router.navigate(['/']); 
  }
}
