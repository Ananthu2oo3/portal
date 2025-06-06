import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  standalone: true,
  selector: 'app-vendor-purchase-order',
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './vendor-purchase-order.component.html',
  styleUrl: './vendor-purchase-order.component.css'
})

export class VendorPurchaseOrderComponent {

vendorData: any[] = [];
  vendorDataKeys: string[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGoodsReceipt();
  }

  fetchGoodsReceipt() {
    this.loading = true;
    this.error = '';
    this.vendorData = [];
    this.vendorDataKeys = [];

    const vendorId = localStorage.getItem('username');

    if (!vendorId) {
      this.error = 'Vendor ID not found in localStorage';
      this.loading = false;
      return;
    }

    const body = { username: vendorId }; 

    this.http.post<any>('http://localhost:3000/api/purchase-order', body).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'SUCCESS' && Array.isArray(res.data) && res.data.length > 0) {
          this.vendorData = res.data;
          this.vendorDataKeys = Object.keys(this.vendorData[0]);
        } else {
          this.error = 'No data found for the vendor';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('HTTP error:', err);
        this.error = 'Server error occurred while fetching data';
      }
    });
  }

  downloadExcel(): void {
    if (!this.vendorData || this.vendorData.length === 0) {
      this.error = 'No data to export';
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.vendorData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(blob, 'goods_receipt_data.xlsx');
  }
}

