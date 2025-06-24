// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   standalone: true,
//   selector: 'app-filter-sort',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './filter-sort.component.html',
//   styleUrl: './filter-sort.component.css'
// })
// export class FilterSortComponent {
//   @Input() data: any[] = [];
//   @Input() fieldKeys: string[] = [];
//   @Output() filteredSorted = new EventEmitter<any[]>();

//   selectedField: string = '';
//   searchText: string = '';

//   ngOnChanges() {
//     this.filteredSorted.emit(this.data);
//   }

//   applyFilter() {
//     let filtered = this.data;

//     if (this.selectedField && this.searchText) {
//       filtered = this.data.filter(item =>
//         (item[this.selectedField] || '').toString().toLowerCase().includes(this.searchText.toLowerCase())
//       );
//     }

//     this.filteredSorted.emit(filtered);
//   }
// }


import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-filter-sort',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-sort.component.html',
  styleUrl: './filter-sort.component.css'
})
export class FilterSortComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() fieldKeys: string[] = [];
  @Output() filteredSorted = new EventEmitter<any[]>();

  selectedField: string = '';
  searchText: string = '';
  isAsc: boolean = true; // true for ASC, false for DESC

  private filteredData: any[] = [];

  ngOnChanges() {
    this.filteredData = [...this.data];
    this.filteredSorted.emit(this.filteredData);
  }

  applyFilter() {
    this.filteredData = this.data;

    if (this.selectedField && this.searchText) {
      this.filteredData = this.data.filter(item =>
        (item[this.selectedField] || '').toString().toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.sortData();
    this.filteredSorted.emit(this.filteredData);
  }

  // onSortOrderToggle() {
  //   this.isAsc = !this.isAsc;
  //   this.sortData();
  //   this.filteredSorted.emit(this.filteredData);
  // }


  onSortOrderToggle() {
    this.sortData();
    this.filteredSorted.emit(this.filteredData);
  }

  private sortData() {
    
  const fieldToSort = this.selectedField || this.fieldKeys[0];

  if (fieldToSort) {
    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valA = (a[fieldToSort] || '').toString().toLowerCase();
      const valB = (b[fieldToSort] || '').toString().toLowerCase();
      if (valA < valB) return this.isAsc ? -1 : 1;
      if (valA > valB) return this.isAsc ? 1 : -1;
      return 0;
    });
  }
}
}
