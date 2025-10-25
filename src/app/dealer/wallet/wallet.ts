// wallet.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../core/Services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class WalletComponent implements OnInit {
  paymentModes: string[] = ['Cash Deposit', 'Cheque', 'UPI', 'Net Banking'];
  isModalVisible = false;
  walletBalance = 0;
  transactions: any[] = [];
  walletForm: FormGroup;

  constructor(private walletService: WalletService, private fb: FormBuilder) {
    this.walletForm = this.fb.group({
      paymentMode: [null, Validators.required],
      paymentProof: [null, Validators.required],
      transactionDate: ['', Validators.required],
      updateDate: ['', Validators.required],
      transactionRefNo: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit() {
    console.log('WalletComponent initialized');
    this.fetchBalance();
    this.fetchTransactions();
  }

  fetchBalance() {
    console.log('Fetching wallet balance');
    this.walletService.getBalance().subscribe({
      next: res => {
        console.log('res', res);
        this.walletBalance = res.balance;
      },
      error: () => this.walletBalance = 0,
    });
  }

fetchTransactions() {
  this.walletService.getTransactions().subscribe({
    next: (data: any) => {
      // Support both an array response and an object with a 'transactions' property
      this.transactions = Array.isArray(data) ? data : (data?.transactions || []);
    },
    error: () => this.transactions = [],
  });
}


  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.walletForm.reset();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.walletForm.patchValue({ paymentProof: file });
    }
  }

  submitTopup() {
    console.log('Submitting top-up with form data:', this.walletForm.value);
    if (this.walletForm.invalid) return;
    const form = this.walletForm.value;
    // Construct FormData if uploading file
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    
    this.walletService.topup(formData)

    // this.walletService.topup(form.amount, form.transactionRefNo)
      .subscribe({
        next: () => {
          this.fetchBalance();
          this.fetchTransactions();
          this.closeModal();
          alert('Top-up successful');
        },
        error: () => alert('Top-up failed'),
      });
  }
}
