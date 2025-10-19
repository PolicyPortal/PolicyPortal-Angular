import { Component, signal, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Define an interface for type-safety
export interface Policy {
  uid: string;
  status: 'Active' | 'Expired' | 'Pending';
  policyNo: string;
  insurer: string;
  riskStartDate: string;
  holderName: string;
  engineNo: string;
  chassisNo: string;
  vehicle: string;
  bodyType: string;
  policyType: string;
  newVehicle: string;
  idv: string;
  premium: string;
  dealership: string;
}

// Sample data (shortened for brevity)
const POLICY_DATA: Policy[] = [
  { uid: '1000466691', status: 'Active', policyNo: '2218003124P108810982', insurer: 'United India Insurance Company Limited', riskStartDate: '13-09-2024 17:56:37', holderName: 'HENA PARIDA', engineNo: 'JC94EG2054078', chassisNo: 'ME4JC942GRG481948', vehicle: 'HONDA - SP 125 DISC OBD2 - null', bodyType: 'BIKE', policyType: '--', newVehicle: 'Yes', idv: '₹ 87,220.00', premium: '₹ 4594', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000466133', status: 'Active', policyNo: '6102321291-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '12-09-2024 16:07:40', holderName: 'MITHUNA SAHU', engineNo: 'JK15EG5457676', chassisNo: 'ME4JK156DRG457914', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,200.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' }

];

@Component({
  selector: 'app-view-policies',
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './view-policies.html',
  styleUrl: './view-policies.scss'
})
export class ViewPolicies implements AfterViewInit {

  displayedColumns: string[] = [
    'uid', 'status', 'policyNo', 'insurer',
    'riskStartDate', 'holderName', 'engineNo', 'chassisNo',
    'vehicle', 'bodyType', 'policyType', 'newVehicle', 'idv',
    'premium', 'dealership',
  ];

  private matDataSource = new MatTableDataSource<Policy>(POLICY_DATA);
  dataSource = signal(this.matDataSource);
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cdr: ChangeDetectorRef) {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      policyNo: new FormControl(''),
      chassisNo: new FormControl('')
    });

    // ✅ FIXED: Correctly implemented filter predicate
    this.dataSource().filterPredicate = (data: Policy, filter: string): boolean => {
      console.log('Filter Predicate Invoked with filter:', filter);
      if (!filter) return true;

      const filterValues = JSON.parse(filter);

      const fromDate = filterValues.fromDate ? new Date(filterValues.fromDate) : null;
      const toDate = filterValues.toDate ? new Date(filterValues.toDate) : null;
      const policyQuery = (filterValues.policyNo || '').toLowerCase();
      const chassisQuery = (filterValues.chassisNo || '').toLowerCase();

      // Adjust toDate to include the entire day for an inclusive range
      if (toDate) {
        toDate.setHours(23, 59, 59, 999);
      }

      // Date Matching Logic
      const riskDateParts = data.riskStartDate.split(' ')[0].split('-');
      const riskDate = new Date(`${riskDateParts[2]}-${riskDateParts[1]}-${riskDateParts[0]}`);
      const dateMatch = (!fromDate || riskDate >= fromDate) && (!toDate || riskDate <= toDate);

      // Text Matching Logic
      const policyMatch = data.policyNo.toLowerCase().includes(policyQuery);
      const chassisMatch = data.chassisNo.toLowerCase().includes(chassisQuery);

      return dateMatch && policyMatch && chassisMatch;
    };
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
    this.cdr.detectChanges();

  }

  // ✅ FIXED: Pass all form values to the filter
  applyFilters() {
    // Pass the entire form value as a JSON string to the predicate
    this.dataSource().filter = JSON.stringify(this.filterForm.value);

    if (this.dataSource().paginator) {
      this.dataSource().paginator?.firstPage();
    }
  }

  resetFilters() {
    this.filterForm.reset({ fromDate: null, toDate: null, policyNo: '', chassisNo: '' });
    // Applying filters with empty values will reset the table
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Expired': return 'badge-danger';
      default: return '';
    }
  }

  getCustomRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `Showing 0 of ${length} results`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `Showing ${startIndex + 1} to ${endIndex} of ${length} results`;
  }
}