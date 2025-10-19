import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

export interface PolicyData {
  previousPolicyId: string;
  customerName: string;
  mobileNumber: string;
  odExpiryDate: string;
  tpExpiryDate: string;
  previousPolicyType: string;
}

// Sample data based on your HTML
const ELEMENT_DATA: PolicyData[] = [
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
  dataSource: MatTableDataSource<PolicyData>;

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
}
