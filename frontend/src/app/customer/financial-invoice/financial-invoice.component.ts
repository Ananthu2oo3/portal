import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { FilterSortComponent } from '../filter-sort/filter-sort.component';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-financial-invoice',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent, FilterSortComponent],
  templateUrl: './financial-invoice.component.html',
  styleUrls: ['./financial-invoice.component.css']
})
export class FinancialInvoiceComponent {
  private http = inject(HttpClient);
  private location = inject(Location);

  salesOrderList: any[] = [];
  fieldKeys: string[] = [];
  filteredList: any[] = [];
  error = '';
  loading = false;
  selectedRow: any = null;

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
        } else {
          this.error = 'Failed to fetch invoice data';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Server error occurred while fetching invoice data';
        this.loading = false;
      }
    });
  }

  selectRow(row: any): void {
    this.selectedRow = row;
  }

  downloadSelectedInvoice(): void {
    if (!this.selectedRow) {
      this.error = 'Please select a row first';
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      this.error = 'Username not found in local storage';
      return;
    }

    const body = {
      username: username,
      doc_no: this.selectedRow['Billed Document']
    };
    console.log('Download request body:', body);
    this.http.post('http://localhost:3000/api/download-customer-invoice', body, {
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, `customer_invoice_${body.doc_no}.pdf`);
      },
      error: (err) => {
        console.error('Download error:', err);
        this.error = 'Failed to download the customer invoice';
      }
    });
  }

  downloadExcel(): void {
    if (!this.salesOrderList.length) {
      this.error = 'No data to export';
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.salesOrderList);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(blob, 'customer_invoices.xlsx');
  }

    goBack() {
    this.location.back();
  }
}


