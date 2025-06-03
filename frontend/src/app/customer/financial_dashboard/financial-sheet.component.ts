import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-financial-sheet',
  standalone: true,
  imports: [CommonModule,SidebarNavComponent],
  templateUrl: './financial-sheet.component.html',
  styleUrl: './financial-sheet.component.css'
})

export class FinancialSheetComponent {

    navigateTo(path: string) {
    window.location.href = '/' + path;
  }

}
