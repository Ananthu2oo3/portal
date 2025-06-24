import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { FilterSortComponent } from '../filter-sort/filter-sort.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-delivery-data',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent, FilterSortComponent],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})

export class DeliveryDataComponent {
  private http = inject(HttpClient);
  private location = inject(Location);
  

  deliveryList: any[] = [];
  fieldKeys: string[] = [];
  filteredList: any[] = [];
  error: string = '';
  loading = false;

  ngOnInit() {
    this.fetchDeliveryData();
  }

  fetchDeliveryData() {
    this.loading = true;
    const username = localStorage.getItem('username');

    if (!username) {
      this.error = 'Username not found in local storage';
      this.loading = false;
      return;
    }

    this.http.post<any>('http://localhost:3000/api/delivery-data', { username }).subscribe({
      next: (res) => {
        if (res.status === 'S' && Array.isArray(res.data)) {
          this.deliveryList = res.data;
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

  downloadExcel(): void {
    if (!this.deliveryList.length) return;
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.deliveryList);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(blob, 'inquiry_data.xlsx');
  }

  goBack() {
    this.location.back();
  }
}
