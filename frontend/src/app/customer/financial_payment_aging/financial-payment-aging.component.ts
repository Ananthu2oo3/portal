import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { FilterSortComponent } from '../filter-sort/filter-sort.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-financial-payment-aging',
  imports: [CommonModule, SidebarNavComponent, FilterSortComponent],
  templateUrl: './financial-payment-aging.component.html',
  styleUrl: './financial-payment-aging.component.css'
})

export class FinancialPaymentAgingComponent {
  
  private http = inject(HttpClient);
  private location = inject(Location);

  salesOrderList: any[] = [];
  fieldKeys: string[] = [];
  filteredList: any[] = [];
  error: string = '';
  loading = false;

  ngOnInit() {
    this.fetchPaymentAgingData();
  }

  fetchPaymentAgingData() {
    this.loading = true;
    const username = localStorage.getItem('username');

    if (!username) {
      this.error = 'Username not found in local storage';
      this.loading = false;
      return;
    }

    this.http.post<any>('http://localhost:3000/api/payment-aging', { username }).subscribe({
      next: (res) => {
        if (res.status === 'S' && Array.isArray(res.data)) {
          this.salesOrderList = res.data;
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
  if (!this.salesOrderList.length) return;

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.salesOrderList);
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
