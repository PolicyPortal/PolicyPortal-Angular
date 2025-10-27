import { ChangeDetectorRef, Component, computed, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// Define an interface for type-safety
export interface Policy {
  uid: string;
  status: string;
  policyNo: string;
  date: string;
  time: string;
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

// Sample data
const POLICY_DATA: Policy[] = [
  { uid: '1000466691', status: 'Active', policyNo: '2218003124P108810982', date: '09-13-2024', time: '17:00:00', insurer: 'United India Insurance Company Limited', riskStartDate: '13-09-2024 17:56:37', holderName: 'HENA PARIDA', engineNo: 'JC94EG2054078', chassisNo: 'ME4JC942GRG481948', vehicle: 'HONDA - SP 125 DISC OBD2 - null', bodyType: 'BIKE', policyType: '--', newVehicle: 'Yes', idv: '₹ 87,220.00', premium: '₹ 4594', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000466133', status: 'Expired', policyNo: '6102321291-00', date: '09-12-2024', time: '16:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '12-09-2024 16:07:40', holderName: 'MITHUNA SAHU', engineNo: 'JK15EG5457676', chassisNo: 'ME4JK156DRG457914', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,200.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Pending', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  // Adding more data for pagination demo
  { uid: '1000465258', status: 'Active', policyNo: '6102306883-00', date: '09-11-2024', time: '10:00:00', insurer: 'Bajaj Allianz', riskStartDate: '11-09-2024 10:17:16', holderName: 'RINA KUMARI', engineNo: 'JK15EW7042962', chassisNo: 'ME4JK158GRW042880', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465259', status: 'Active', policyNo: '6102306884-00', date: '09-12-2024', time: '11:00:00', insurer: 'ICICI Lombard', riskStartDate: '12-09-2024 11:17:16', holderName: 'SANJAY BEHERA', engineNo: 'JK15EW7042963', chassisNo: 'ME4JK158GRW042881', vehicle: 'HONDA - SP 125', bodyType: 'BIKE', policyType: '--', newVehicle: 'Yes', idv: '₹ 88,000.00', premium: '₹ 4600', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
  { uid: '1000465257', status: 'Active', policyNo: '6102306882-00', date: '09-10-2024', time: '18:00:00', insurer: 'Tata AIG General Insurance Company Limited', riskStartDate: '10-09-2024 18:17:16', holderName: 'SIBARAM MAHANKUDA', engineNo: 'JK15EW7042961', chassisNo: 'ME4JK158GRW042879', vehicle: 'HONDA - ACTIVA - DLX OBD2', bodyType: 'SCOOTER', policyType: '--', newVehicle: 'Yes', idv: '₹ 77,245.00', premium: '₹ 4707', dealership: 'AYAM AUTOMOBILES - BUGUDA' },
];

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatTooltipModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

  // --- STATE AND SIGNALS ---

  // Form for filters
  filterForm = new FormGroup({
    fromDate: new FormControl(null),
    toDate: new FormControl(null),
    policyNo: new FormControl(''),
    chassisNo: new FormControl('')
  });

  // All policy data
  allPolicies = signal(POLICY_DATA);

  // Signal to hold the *active* filters, applied on "Search"
  activeFilters = signal({
    fromDate: null as Date | null,
    toDate: null as Date | null,
    policyNo: '',
    chassisNo: ''
  });

  // Pagination state
  pageSize = signal(5);
  currentPage = signal(1);

  // --- COMPUTED SIGNALS ---

  /**
   * Filters policies based on the activeFilters signal.
   * This replaces the MatTableDataSource.filterPredicate.
   */
  filteredPolicies = computed(() => {
    const { fromDate, toDate, policyNo, chassisNo } = this.activeFilters();
    const policyQuery = policyNo.toLowerCase();
    const chassisQuery = chassisNo.toLowerCase();

    // Adjust toDate to include the entire day for an inclusive range
    let adjustedToDate: Date | null = null;
    if (toDate) {
      adjustedToDate = new Date(toDate);
      adjustedToDate.setHours(23, 59, 59, 999);
    }
    
    return this.allPolicies().filter(data => {
      // Date Matching Logic
      // The data date format is MM-DD-YYYY, which is not ideal.
      // We must parse it correctly.
      const riskDateParts = data.riskStartDate.split(' ')[0].split('-');
      // Assuming MM-DD-YYYY format from data
      const riskDate = new Date(`${riskDateParts[2]}-${riskDateParts[0]}-${riskDateParts[1]}`);
      
      const dateMatch = (!fromDate || riskDate >= fromDate) && 
                          (!adjustedToDate || riskDate <= adjustedToDate);

      // Text Matching Logic
      const policyMatch = policyQuery ? data.policyNo.toLowerCase().includes(policyQuery) : true;
      const chassisMatch = chassisQuery ? data.chassisNo.toLowerCase().includes(chassisQuery) : true;

      return dateMatch && policyMatch && chassisMatch;
    });
  });

  /**
   * Calculates the total number of pages.
   */
  totalPages = computed(() => {
    return Math.ceil(this.filteredPolicies().length / this.pageSize());
  });

  /**
   * Slices the filtered policies for the current page.
   * This replaces the MatPaginator.
   */
  paginatedPolicies = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const policies = this.filteredPolicies();
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    return policies.slice(startIndex, endIndex);
  });

  /**
   * Creates the "Showing 1 to 10 of 50" text.
   */
  paginationInfo = computed(() => {
    const length = this.filteredPolicies().length;
    const size = this.pageSize();
    const page = this.currentPage();

    if (length === 0) {
      return `Showing 0 of 0 results`;
    }

    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${length} results`;
  });

  // --- METHODS ---

  /**
   * Applies the current filter input values to the activeFilters signal
   * and resets pagination.
   */
  applyFilters() {
    const formVal = this.filterForm.value;
    this.activeFilters.set({
      fromDate: formVal.fromDate ? new Date(formVal.fromDate) : null,
      toDate: formVal.toDate ? new Date(formVal.toDate) : null,
      policyNo: formVal.policyNo || '',
      chassisNo: formVal.chassisNo || ''
    });
    // Go back to first page on new search
    this.currentPage.set(1);
  }

  /**
   * Resets all filter inputs and the activeFilters.
   */
  resetFilters() {
    this.filterForm.reset({
      fromDate: null,
      toDate: null,
      policyNo: '',
      chassisNo: ''
    });
    // Applying empty filters will show all results
    this.applyFilters();
  }

  /**
   * Gets the correct Bootstrap badge class for the status.
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'text-bg-success-subtle border border-success-subtle';
      case 'pending': return 'text-bg-warning-subtle border border-warning-subtle';
      case 'expired': return 'text-bg-danger-subtle border border-danger-subtle';
      default: return 'text-bg-secondary-subtle border border-secondary-subtle';
    }
  }

  // --- PAGINATION METHODS ---

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
