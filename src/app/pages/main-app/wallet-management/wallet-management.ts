import { Component } from '@angular/core';

@Component({
  selector: 'app-wallet-management',
  imports: [],
  templateUrl: './wallet-management.html',
  styleUrl: './wallet-management.scss'
})
export class WalletManagement {

  
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
