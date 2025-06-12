import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-financial-invoice',
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './financial-invoice.component.html',
  styleUrls: ['./financial-invoice.component.css']
})
export class FinancialInvoiceComponent {
  private http = inject(HttpClient);

  salesOrderList: any[] = [];
  fieldKeys: string[] = [];
  error = '';
  loading = false;
  pdfBase64: string = '';

  ngOnInit() {
    this.fetchInvoiceData();
  }

  fetchInvoiceData() {
    this.loading = true;
    const username = localStorage.getItem('username');
    if (!username) {
      this.error = 'Username not found in local storage';
      this.loading = false;
      return;
    }

    this.http.post<any>('http://localhost:3000/api/invoice-data', { username }).subscribe({
      next: (res) => {
        if (res.status === 'S') {
          this.salesOrderList = res.data || [];
          this.fieldKeys = Object.keys(this.salesOrderList[0] || {});
          this.pdfBase64 = res.pdfBase64;
        } else {
          this.error = 'Failed to fetch data';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Server error';
        this.loading = false;
      }
    });
  }

  viewPDF() {
    if (!this.pdfBase64) {
      this.error = 'PDF not available';
      return;
    }
    const byteCharacters = atob(this.pdfBase64);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  downloadPDF() {
    if (!this.pdfBase64) {
      this.error = 'PDF not available';
      return;
    }
    const byteCharacters = atob(this.pdfBase64);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    FileSaver.saveAs(blob, 'invoice.pdf');
  }

  downloadExcel() {
    if (!this.salesOrderList.length) return;

    const worksheet = XLSX.utils.json_to_sheet(this.salesOrderList);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(blob, 'invoices.xlsx');
  }
}



