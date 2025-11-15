import { AfterViewInit, Component, computed, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

export interface ExpiredPolicy {
  previousPolicyId: string;
  customerName: string;
  mobileNumber: string;
  odExpiryDate: string;
  tpExpiryDate: string;
  previousPolicyType: string;
}

// Sample data based on your HTML
const ELEMENT_DATA: ExpiredPolicy[] = [
  { previousPolicyId: 'POL-72654', customerName: 'John Doe', mobileNumber: '9876543210', odExpiryDate: '2025-10-31', tpExpiryDate: '2025-11-15', previousPolicyType: 'Comprehensive' },
  { previousPolicyId: 'POL-98213', customerName: 'Jane Smith', mobileNumber: '9988776655', odExpiryDate: '2025-11-05', tpExpiryDate: '2025-11-20', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-34567', customerName: 'Peter Jones', mobileNumber: '9123456789', odExpiryDate: '2025-11-10', tpExpiryDate: '2025-11-25', previousPolicyType: 'Comprehensive' },
  { previousPolicyId: 'POL-45892', customerName: 'Mary Williams', mobileNumber: '9234567890', odExpiryDate: '2025-11-12', tpExpiryDate: '2025-11-28', previousPolicyType: 'Comprehensive' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
  { previousPolicyId: 'POL-12398', customerName: 'David Brown', mobileNumber: '9345678901', odExpiryDate: '2025-11-18', tpExpiryDate: '2025-12-01', previousPolicyType: 'Third Party' },
];

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})


export class Dashboard implements AfterViewInit {
  // Define the columns that will be displayed in the table. The order matters.
  displayedColumns: string[] = [
    'previousPolicyId',
    'customerName',
    'mobileNumber',
    'odExpiryDate',
    'tpExpiryDate',
    'previousPolicyType',
    'action'
  ];
  
  
  
  // The data source that will provide the data to the table
  dataSource: MatTableDataSource<ExpiredPolicy>;

  // Get a reference to the paginator and sort elements from the template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Initialize the data source with the sample data
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  // This lifecycle hook is called after the view has been initialized
  ngAfterViewInit() {
    // Connect the paginator and sort to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // --- NEW: CUSTOM LABEL FUNCTION ---
 getCustomRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `Showing 0 of ${length} results`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `Showing ${startIndex + 1} to ${endIndex} of ${length} results`;
  }


  // --- PAGINATION METHODS ---
 // Pagination state
  pageSize = signal(5);
  currentPage = signal(1);

  // --- COMPUTED SIGNALS ---

  // /**
  //  * Filters policies based on the activeFilters signal.
  //  * This replaces the MatTableDataSource.filterPredicate.
  //  */
  // filteredPolicies = computed(() => {
  //   const { fromDate, toDate, policyNo, chassisNo } = this.activeFilters();
  //   const policyQuery = policyNo.toLowerCase();
  //   const chassisQuery = chassisNo.toLowerCase();

  //   // Adjust toDate to include the entire day for an inclusive range
  //   let adjustedToDate: Date | null = null;
  //   if (toDate) {
  //     adjustedToDate = new Date(toDate);
  //     adjustedToDate.setHours(23, 59, 59, 999);
  //   }
    
  //   return this.allPolicies().filter(data => {
  //     // Date Matching Logic
  //     // The data date format is MM-DD-YYYY, which is not ideal.
  //     // We must parse it correctly.
  //     const riskDateParts = data.riskStartDate.split(' ')[0].split('-');
  //     // Assuming MM-DD-YYYY format from data
  //     const riskDate = new Date(`${riskDateParts[2]}-${riskDateParts[0]}-${riskDateParts[1]}`);
      
  //     const dateMatch = (!fromDate || riskDate >= fromDate) && 
  //                         (!adjustedToDate || riskDate <= adjustedToDate);

  //     // Text Matching Logic
  //     const policyMatch = policyQuery ? data.policyNo.toLowerCase().includes(policyQuery) : true;
  //     const chassisMatch = chassisQuery ? data.chassisNo.toLowerCase().includes(chassisQuery) : true;

  //     return dateMatch && policyMatch && chassisMatch;
  //   });
  // });

  /**
   * Calculates the total number of pages.
   */
  totalPages = computed(() => {
    return Math.ceil(this.dataSource.data.length / this.pageSize());
  });

  /**
   * Slices the filtered policies for the current page.
   * This replaces the MatPaginator.
   */
  paginatedPolicies = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const policies = this.dataSource.data;
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    return policies.slice(startIndex, endIndex);
  });

  /**
   * Creates the "Showing 1 to 10 of 50" text.
   */
  paginationInfo = computed(() => {
    const length = this.dataSource.data.length;
    const size = this.pageSize();
    const page = this.currentPage();

    if (length === 0) {
      return `Showing 0 of 0 results`;
    }

    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${length} results`;
  });
  

  goToPage(page: number) {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())));
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(newSize);
    this.currentPage.set(1); // Reset to first page
  }
}
