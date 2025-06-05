import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})

export class VendorDashboardComponent {
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

  navigateTo(path: string) {
    window.location.href = '/' + path;
  }
}




