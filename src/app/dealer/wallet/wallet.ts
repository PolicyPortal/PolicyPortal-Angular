import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss'
})
export class Wallet {

  paymentModes: string[] = ['Cash Deposit', 'Cheque',  'UPI', 'Net Banking'];
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
