import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
// Define an interface for type-safety
export interface Policy {
  uid: string;
  status: string;
  policyNo: string;
  // date: string;
  // time: string;
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
];

@Component({
  selector: 'app-view-policies',
  imports: [
    // Add all required Material modules here
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
],
  templateUrl: './view-policies.html',
  styleUrl: './view-policies.scss'
})
export class ViewPolicies {

    displayedColumns: string[] = [
    'uid', 'status', 'policyNo', 'insurer',
    'riskStartDate', 'holderName', 'engineNo', 'chassisNo',
    'vehicle', 'bodyType', 'policyType', 'newVehicle', 'idv',
    'premium', 'dealership', 
  ];

  // The data source that will provide the data to the table
  dataSource: MatTableDataSource<Policy>;

  // Get a reference to the paginator and sort elements from the template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Initialize the data source with the sample data
    this.dataSource = new MatTableDataSource(POLICY_DATA);
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
