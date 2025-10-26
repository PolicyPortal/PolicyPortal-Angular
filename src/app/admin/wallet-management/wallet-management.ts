import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const TRANSACTIONDATA = [
  {
    transaction_date: '2024-06-01T10:15:30Z',
    transactionrefno: 'TXN123456',
    payment_mode: 'UPI',
    amount: 5000,
    status: 'approved',
    attachment: 'receipt1.pdf',
    created_at: '2024-06-01T10:20:00Z',
    update_date: '2024-06-02T12:00:00Z'
  },
  {
    transaction_date: '2024-06-05T14:30:00Z',
    transactionrefno: 'TXN123457',
    payment_mode: 'Net Banking',
    amount: 7500,
    status: 'Pending',
    attachment: null,
    created_at: '2024-06-05T14:35:00Z',
    update_date: '2024-06-06T09:00:00Z'
  },
  {
    transaction_date: '2024-06-10T09:00:00Z',
    transactionrefno: 'TXN123458',
    payment_mode: 'Cheque',
    amount: 10000,
    status: 'Rejected',
    attachment: 'cheque_image.jpg',
    created_at: '2024-06-10T09:05:00Z',
    update_date: '2024-06-11T11:30:00Z'
  } 
    
];


@Component({
  selector: 'app-wallet-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-management.html',
  styleUrl: './wallet-management.scss'
})
export class WalletManagement implements OnInit {

  transactions: any[] = [];
  // filteredTransactions: any[] = [];


  constructor() {}

  ngOnInit() {
    this.transactions = TRANSACTIONDATA;
  }

  
   // Property to control the modal's visibility. It's false by default.
  isModalVisible = false;

  /**
   * Opens the payment modal by setting the visibility property to true.
   */
  openModal(): void {
    this.isModalVisible = true;
  }

  /**
   * Closes the payment modal by setting the visibility property to false.
   */
  closeModal(): void {
    this.isModalVisible = false;
  }
}
