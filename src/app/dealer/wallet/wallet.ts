import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WalletService, TopupRequest } from '../../core/Services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WalletComponent implements OnInit {
  paymentModes: string[] = ['Cash Deposit', 'Cheque', 'UPI', 'Net Banking'];

  filterRefNo = signal('');
  filterStatus = signal('All');
  filterDate = signal(''); // YYYY-MM-DD format

  activeFilters = signal({ refNo: '', status: 'All', date: '' });
  transactions = signal<TopupRequest[]>([]);

  isModalVisible = signal(false);
  walletBalance = signal(0);
  walletForm;

  constructor(private walletService: WalletService, private fb: FormBuilder) {
    this.walletForm = this.fb.group({
      paymentMode: [null, Validators.required],
      paymentProof: [null as File | null, Validators.required],
      transactionDate: ['', Validators.required],
      updateDate: ['', Validators.required],
      transactionRefNo: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }


  ngOnInit(): void {
    this.fetchBalance();
    this.fetchTransactions();
  }

  fetchBalance(): void {
    this.walletService.getBalance().subscribe({
      next: (res) => {
        this.walletBalance.set(res.balance);
      },
      error: () => this.walletBalance.set(0)
    });
  }

  fetchTransactions(): void {
    this.walletService.getTransactions().subscribe({
      next: (data: { transactions?: TopupRequest[] } | TopupRequest[]) => {
        const txData = Array.isArray(data) ? data : data?.transactions || [];
        this.transactions.set(txData);
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.transactions.set([]);
      }
    });
  }

  openModal(): void {
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.walletForm.reset();
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.walletForm.patchValue({ paymentProof: file });
    }
  }

  submitTopup(): void {
    if (this.walletForm.invalid) return;

    const formData = new FormData();
    const formValue = this.walletForm.value;
    formData.append('amount', formValue.amount!);
    formData.append('payment_mode', formValue.paymentMode!);
    formData.append('payment_proof_url', formValue.paymentProof!);
    formData.append('transaction_ref_no', formValue.transactionRefNo!);
    formData.append('transaction_date', formValue.transactionDate!);

    this.walletService.submitTopupRequest({
      amount: parseFloat(formValue.amount!),
      payment_mode: formValue.paymentMode!,
      payment_proof: formValue.paymentProof!,
      transaction_ref_no: formValue.transactionRefNo!,
      transaction_date: formValue.transactionDate!
    }).subscribe({
      next: () => {
        this.fetchBalance();
        this.fetchTransactions();
        this.closeModal();
        console.log('Top-up successful');
      },
      error: (err) => {
        console.error('Top-up failed', err);
      }
    });
  }

  filteredTransactions = computed(() => {
    const { refNo, status, date } = this.activeFilters();
    const lowerRefNo = refNo.toLowerCase();
    const lowerStatus = status.toLowerCase();

    if (!lowerRefNo && lowerStatus === 'all' && !date) {
      return this.transactions();
    }

    return this.transactions().filter((tx) => {
      const txRefNo = tx.transaction_ref_no?.toLowerCase() ?? '';
      const txStatus = (tx.status ?? '').toLowerCase();
      const txDate = tx.transaction_date?.substring(0, 10) ?? '';

      const matchRefNo = lowerRefNo ? txRefNo.includes(lowerRefNo) : true;
      const matchStatus = lowerStatus !== 'all' ? txStatus === lowerStatus : true;
      const matchDate = date ? txDate === date : true;

      return matchRefNo && matchStatus && matchDate;
    });
  });

  applyFilters(): void {
    this.activeFilters.set({
      refNo: this.filterRefNo(),
      status: this.filterStatus(),
      date: this.filterDate()
    });
  }

  resetFilters(): void {
    this.filterRefNo.set('');
    this.filterStatus.set('All');
    this.filterDate.set('');
    this.activeFilters.set({ refNo: '', status: 'All', date: '' });
  }
}
