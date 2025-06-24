// import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   standalone: true,
//   selector: 'app-filter-sort',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './filter-sort.component.html',
//   styleUrl: './filter-sort.component.css'
// })
// export class FilterSortComponent implements OnChanges {
//   @Input() data: any[] = [];
//   @Input() fieldKeys: string[] = [];
//   @Output() filteredSorted = new EventEmitter<any[]>();

//   selectedField: string = '';
//   searchText: string = '';
//   isAsc: boolean = true; // true for ASC, false for DESC

//   private filteredData: any[] = [];

//   ngOnChanges() {
//     this.filteredData = [...this.data];
//     this.filteredSorted.emit(this.filteredData);
//   }

//   applyFilter() {
//     this.filteredData = this.data;

//     if (this.selectedField && this.searchText) {
//       this.filteredData = this.data.filter(item =>
//         (item[this.selectedField] || '').toString().toLowerCase().includes(this.searchText.toLowerCase())
//       );
//     }

//     this.sortData();
//     this.filteredSorted.emit(this.filteredData);
//   }

//   // onSortOrderToggle() {
//   //   this.isAsc = !this.isAsc;
//   //   this.sortData();
//   //   this.filteredSorted.emit(this.filteredData);
//   // }


//   onSortOrderToggle() {
//     this.sortData();
//     this.filteredSorted.emit(this.filteredData);
//   }

//   private sortData() {
    
//   const fieldToSort = this.selectedField || this.fieldKeys[0];

//   if (fieldToSort) {
//     this.filteredData = [...this.filteredData].sort((a, b) => {
//       const valA = (a[fieldToSort] || '').toString().toLowerCase();
//       const valB = (b[fieldToSort] || '').toString().toLowerCase();
//       if (valA < valB) return this.isAsc ? -1 : 1;
//       if (valA > valB) return this.isAsc ? 1 : -1;
//       return 0;
//     });
//   }
// }
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
    // On input change: reset to full data and emit
    this.filteredData = [...this.data];
    this.filteredSorted.emit(this.filteredData);
  }

  applyFilter() {
    // Always filter from full data, not from already filtered copy
    if (this.selectedField && this.searchText) {
      this.filteredData = this.data.filter(item =>
        (item[this.selectedField] || '')
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    } else {
      // If no filter, use full data
      this.filteredData = [...this.data];
    }

    // After filter, sort it
    this.sortData();
    this.filteredSorted.emit(this.filteredData);
  }

  onSortOrderToggle() {
    // Flip the toggle flag!
    // this.isAsc = !this.isAsc;

    // Sort current data
    this.sortData();
    this.filteredSorted.emit(this.filteredData);
  }

  private sortData() {
    // Use selectedField, or default to first key
    const fieldToSort = this.selectedField || this.fieldKeys[0];

    if (!fieldToSort) return; // no valid field to sort

    this.filteredData = [...this.filteredData].sort((a, b) => {
      let valA = a[fieldToSort];
      let valB = b[fieldToSort];

      // If both are numbers, compare numerically
      if (!isNaN(valA) && !isNaN(valB)) {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return this.isAsc ? -1 : 1;
      if (valA > valB) return this.isAsc ? 1 : -1;
      return 0;
    });
  }
}

