import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Mock Data for Transactions - Now includes dealer info
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
  {
    transaction_date: '2024-06-05T14:30:00Z',
    transactionrefno: 'TXN123457',
    payment_mode: 'Net Banking',
    amount: 7500,
    status: 'Pending',
    attachment: null,
    created_at: '2024-06-05T14:35:00Z',
    update_date: '2024-06-06T09:00:00Z',
    dealerName: 'Gadget World'
  },
  {
    transaction_date: '2024-06-10T09:00:00Z',
    transactionrefno: 'TXN123458',
    payment_mode: 'Cheque',
    amount: 10000,
    status: 'Rejected',
    attachment: 'cheque_image.jpg',
    created_at: '2024-06-10T09:05:00Z',
    update_date: '2024-06-11T11:30:00Z',
    dealerName: 'Sunrise Electronics'
  },
  {
    transaction_date: '2024-06-12T11:00:00Z',
    transactionrefno: 'TXN123459',
    payment_mode: 'Credit Card',
    amount: 2500,
    status: 'approved',
    attachment: 'receipt2.pdf',
    created_at: '2024-06-12T11:05:00Z',
    update_date: '2024-06-12T11:30:00Z',
    dealerName: 'Tech Hub'
  },
  {
    transaction_date: '2024-06-13T15:00:00Z',
    transactionrefno: 'TXN123460',
    payment_mode: 'UPI',
    amount: 3000,
    status: 'Pending',
    attachment: 'receipt3.pdf',
    created_at: '2024-06-13T15:05:00Z',
    update_date: '2024-06-13T15:05:00Z',
    dealerName: 'Gadget World'
  }
];



@Component({
  selector: 'app-wallet-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-management.html',
  styleUrl: './wallet-management.scss'
})
export class WalletManagement {

  // Use signals for reactive state management
  transactions = signal(TRANSACTIONDATA);

  // Signals for filter inputs
  filterRefNo = signal('');
  filterStatus = signal('All');
  filterDate = signal(''); // Will store YYYY-MM-DD
  filterDealer = signal('All'); // New signal for dealer filter

   // NEW: Signal for the dealer balance dropdown
  selectedDealerBalance = signal('All');

  // Signal to hold the *active* filters, applied on "Search"
  activeFilters = signal({ refNo: '', status: 'All', date: '', dealer: 'All' });

  // Computed signal to get unique dealer names for the filter dropdown
  dealers = computed(() => {
    const dealerNames = this.transactions().map(tx => tx.dealerName);
    return [...new Set(dealerNames)]; // Unique list of dealers
  });

   // NEW: Computed signal for dealer balances
  dealerBalances = computed(() => {
    const approvedTxs = this.transactions().filter(tx => tx.status.toLowerCase() === 'approved');
    const allDealers = this.dealers(); // Get the unique list of all dealers

    return allDealers.map(dealerName => {
      // Calculate balance for this specific dealer
      const balance = approvedTxs
        .filter(tx => tx.dealerName === dealerName)
        .reduce((acc, tx) => acc + tx.amount, 0);
      
      return { name: dealerName, balance: balance };
    }).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  });

  // NEW: Computed signal to get the balance for the selected dealer
  selectedDealerInfo = computed(() => {
    const dealerName = this.selectedDealerBalance();
    if (dealerName === 'All') {
      return null;
    }
    return this.dealerBalances().find(d => d.name === dealerName) || null;
  });


  // Computed signal to filter transactions based on activeFilters
  filteredTransactions = computed(() => {
    const { refNo, status, date, dealer } = this.activeFilters();
    const lowerRefNo = refNo.toLowerCase();
    const lowerStatus = status.toLowerCase();
    const lowerDealer = dealer.toLowerCase();

    // If no filters are active, return all transactions
    if (!lowerRefNo && lowerStatus === 'all' && !date && lowerDealer === 'all') {
      return this.transactions();
    }

    return this.transactions().filter(tx => {
      const txRefNo = tx.transactionrefno.toLowerCase();
      const txStatus = tx.status.toLowerCase();
      const txDate = tx.transaction_date.substring(0, 10); // Get 'YYYY-MM-DD'
      const txDealer = tx.dealerName.toLowerCase();

      // Check each filter condition
      const matchRefNo = lowerRefNo ? txRefNo.includes(lowerRefNo) : true;
      const matchStatus = lowerStatus !== 'all' ? txStatus === lowerStatus : true;
      const matchDate = date ? txDate === date : true;
      const matchDealer = lowerDealer !== 'all' ? txDealer === lowerDealer : true;

      // Return true only if all conditions match
      return matchRefNo && matchStatus && matchDate && matchDealer;
    });
  });

  constructor() {}

  /**
   * Applies the current filter input values to the activeFilters signal,
   * triggering the computed filteredTransactions to update.
   */
  applyFilters(): void {
    this.activeFilters.set({
      refNo: this.filterRefNo(),
      status: this.filterStatus(),
      date: this.filterDate(),
      dealer: this.filterDealer()
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
    this.filterDealer.set('All');
    this.activeFilters.set({ refNo: '', status: 'All', date: '', dealer: 'All' });
  }

  /**
   * Approves a transaction by its reference number.
   */
  approveTransaction(refNo: string): void {
    //confirm('Are you sure you want to approve this transaction?'); ask for confirmation or cancel
    if (!confirm('Are you sure you want to approve this transaction?')) {
      return; // Exit if user cancels
    }
    this.transactions.update(currentTxs => 
      currentTxs.map(tx => 
        tx.transactionrefno === refNo 
          ? { ...tx, status: 'approved', update_date: new Date().toISOString() } 
          : tx
      )
    );
  }

  /**
   * Rejects a transaction by its reference number.
   */
  rejectTransaction(refNo: string): void {
    //confirm('Are you sure you want to reject this transaction?'); ask for confirmation or cancel
    if (!confirm('Are you sure you want to reject this transaction?')) {
      return; // Exit if user cancels
    }
    this.transactions.update(currentTxs => 
      currentTxs.map(tx => 
        tx.transactionrefno === refNo 
          ? { ...tx, status: 'Rejected', update_date: new Date().toISOString() } 
          : tx
      )
    );
  }
}


