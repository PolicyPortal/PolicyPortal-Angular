import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../core/Services/wallet.service';

// Mock Data for Transactions - Kept here for context, though you fetch from service
const TRANSACTIONDATA = [
 {
  transaction_date: '2024-06-01T10:15:30Z',
  transactionrefno: 'TXN123456',
  payment_mode: 'UPI',
  amount: 5000,
  status: 'approved',
  attachment: 'receipt1.pdf',
  created_at: '2024-06-01T10:20:00Z',
  update_date: '2024-06-02T12:00:00Z',
  dealerName: 'Sunrise Electronics'
 },
 // ... other mock data ...
];


@Component({
 selector: 'app-wallet',
 templateUrl: './wallet.html',
 styleUrls: ['./wallet.scss'],
 imports: [CommonModule, ReactiveFormsModule],
})
export class WalletComponent implements OnInit {
 paymentModes: string[] = ['Cash Deposit', 'Cheque', 'UPI', 'Net Banking'];
  // Signals for filter inputs
 filterRefNo = signal('');
 filterStatus = signal('All');
 filterDate = signal(''); // Will store YYYY-MM-DD
 
  // Signal to hold the *active* filters, applied on "Search"
  // Removed 'dealer'
 activeFilters = signal({ refNo: '', status: 'All', date: ''});
 
  // Initialize as empty array, will be populated by fetchTransactions
 transactions = signal<any[]>([]);
 

 isModalVisible = false;
 walletBalance = 0;
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
        const txData = Array.isArray(data) ? data : (data?.transactions || []);
     this.transactions.set(txData); // Use .set() to update the signal
     console.log('Fetched transactions:', this.transactions());
    },
  
    error: (err) => {
     console.error('Error fetching transactions:', err);
     this.transactions.set([]);
    },
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
   .subscribe({
    next: () => {
     this.fetchBalance();
     this.fetchTransactions();
     this.closeModal();
     // NOTE: alert() is blocking and not recommended.
          // Consider a toast notification service instead.
     console.log('Top-up successful'); 
    },
    error: () => console.error('Top-up failed'),
   });
 }



  // Computed signal to filter transactions based on activeFilters
  // Removed 'dealer' logic
 filteredTransactions = computed(() => {
  const { refNo, status, date } = this.activeFilters();
  const lowerRefNo = refNo.toLowerCase();
  const lowerStatus = status.toLowerCase();

  // If no filters are active, return all transactions
  if (!lowerRefNo && lowerStatus === 'all' && !date ) {
   return this.transactions();
  }

  return this.transactions().filter(tx => {
   const txRefNo = tx.transactionrefno?.toLowerCase() || '';
   const txStatus = tx.status?.toLowerCase() || '';
   const txDate = tx.transaction_date?.substring(0, 10) || ''; // Get 'YYYY-MM-DD'

   // Check each filter condition
   const matchRefNo = lowerRefNo ? txRefNo.includes(lowerRefNo) : true;
   const matchStatus = lowerStatus !== 'all' ? txStatus === lowerStatus : true;
   const matchDate = date ? txDate === date : true;

   // Return true only if all conditions match
   return matchRefNo && matchStatus && matchDate;
  });
 });

 
 /**
 * Applies the current filter input values to the activeFilters signal,
 * triggering the computed filteredTransactions to update.
 */
 applyFilters(): void {
    // Removed 'dealer'
  this.activeFilters.set({
   refNo: this.filterRefNo(),
   status: this.filterStatus(),
   date: this.filterDate(),
  });
 }

 /**
 * Resets all filter inputs and the activeFilters,
 * showing all transactions again.
 */
 resetFilters(): void {
  this.filterRefNo.set('');
  this.filterStatus.set('All');
  this.filterDate.set('');
    // Removed 'dealer'
  this.activeFilters.set({ refNo: '', status: 'All', date: ''});
 }
}
