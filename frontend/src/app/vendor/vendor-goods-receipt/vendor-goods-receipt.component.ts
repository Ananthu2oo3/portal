import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-vendor-quotation-request',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './vendor-goods-receipt.component.html',
  styleUrls: ['./vendor-goods-receipt.component.css']
})
export class VendorQuotationRequestComponent implements OnInit {
  vendorData: any = null;
  vendorDataKeys: string[] = [];
  error: string = '';
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGoodsReceipt();
  }

  fetchGoodsReceipt() {
    this.loading = true;
    
    const vendorId = localStorage.getItem('username'); 

    if (!vendorId) {
      this.error = 'Vendor ID not found in localStorage';
      this.loading = false;
      return;
    }

    const params = new HttpParams().set('VendorNo', vendorId); 

    this.http.get<any>('http://localhost:3000/api/goods-receipt', { params }).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          this.vendorData = res.data;
          this.vendorDataKeys = Object.keys(this.vendorData[0]);

        } else {
          this.error = 'Failed to fetch vendor profile';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('HTTP error:', err);
        this.error = 'Server error';
        this.loading = false;
      }
    });
  }

  downloadExcel(): void {
      if (!this.vendorData.length) return;
    
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.vendorData);
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
}
