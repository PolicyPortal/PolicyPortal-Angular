import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { WalletService, TopupRequest } from '../../core/Services/wallet.service';

@Component({
  selector: 'app-wallet-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-management.html',
  styleUrls: ['./wallet-management.scss'],
  standalone: true,
})
export class WalletManagement {
  // Signals for state
      isLoading = signal(true);

  transactions = signal<TopupRequest[]>([]);
  dealerBalances = signal<{ dealers: { name: string; balance: number; }[] }>({ dealers: [] });

  // Signals for filter inputs
  filterRefNo = signal('');
  filterStatus = signal('All');
  filterDate = signal('');
  filterDealer = signal('All');

  // Signal for applied filters
  activeFilters = signal({ refNo: '', status: 'All', date: '', dealer: 'All' });
  
  // Signal for the balance card dropdown
  selectedDealerBalance = signal('All');

  constructor(private walletService: WalletService) {
    this.isLoading.set(true);
    // Fetch all dealer balances on init
    this.walletService.getAllDealerWithBalance().subscribe({
      next: (data) => {
        // FIX: Normalize the API response to match the signal's type
        const normalizedData = Array.isArray(data)
          ? { dealers: data } // If data is [], wrap it to { dealers: [] }
          : (data || { dealers: [] }); // Otherwise, use data or default

        console.log('Loaded dealer balances:', normalizedData);
        this.dealerBalances.set(normalizedData); // Now this sets the correct object shape
      },
      error: (err) => {
        console.error('Failed to load dealer balances:', err);
        this.dealerBalances.set({ dealers: [] });
      }
    });

    // Fetch all transactions on init
    this.fetchTransactions();
  }

  // Get unique dealer names from the master dealer balance list
  dealers = computed(() => {
    const dealerData = this.dealerBalances(); // This is { dealers: [...] }
    if (!dealerData || !dealerData.dealers) {
      return [];
    }
    // Map the array of {name, balance} objects to just an array of names
    return dealerData.dealers.map(d => d.name).filter(name => name);
  });

  // Get the info for the dealer selected in the balance card
  selectedDealerInfo = computed(() => {
    const dealerName = this.selectedDealerBalance();
    const dealers = this.dealerBalances()?.dealers;
    
    console.log('Selected dealer info:', dealers, dealerName);
    
    if (!dealers || dealerName === 'All') {
      return null;
    }
    
    const dealer = dealers.find(d => d.name === dealerName);
    return dealer ? { dealerName: dealer.name, dealerBalance: dealer.balance } : null;
  });

  // Filter the transactions based on the active filters
  filteredTransactions = computed(() => {
    const { refNo, status, date, dealer } = this.activeFilters();
    const lowerRefNo = refNo.toLowerCase();
    const lowerStatus = status.toLowerCase();
    const lowerDealer = dealer.toLowerCase();

    return this.transactions().filter(tx => {
      const txRefNo = (tx.transaction_ref_no || '').toLowerCase();
      const txStatus = (tx.status || '').toLowerCase();
      const txDate = (tx.transaction_date || '').substring(0, 10);
      const txDealer = (tx.dealer_name || '').toLowerCase();

      const matchesRefNo = lowerRefNo ? txRefNo.includes(lowerRefNo) : true;
      const matchesStatus = lowerStatus !== 'all' ? txStatus === lowerStatus : true;
      const matchesDate = date ? txDate === date : true;
      const matchesDealer = lowerDealer !== 'all' ? txDealer === lowerDealer : true;

      return matchesRefNo && matchesStatus && matchesDate && matchesDealer;
    });
  });

  // Fetch all transactions from backend
  fetchTransactions(): void {
    this.walletService.getTransactions().subscribe({
      next: (data) => {
        const txs = Array.isArray(data) ? data : data?.transactions || [];
        this.transactions.set(txs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load transactions:', err);
        this.transactions.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Apply the current filter values
  applyFilters(): void {
    this.activeFilters.set({
      refNo: this.filterRefNo(),
      status: this.filterStatus(),
      date: this.filterDate(),
      dealer: this.filterDealer()
    });
  }

  // Reset all filters to their default state
  resetFilters(): void {
    this.filterRefNo.set('');
    this.filterStatus.set('All');
    this.filterDate.set('');
    this.filterDealer.set('All');
    this.activeFilters.set({ refNo: '', status: 'All', date: '', dealer: 'All' });
  }

  // Approve a pending transaction
  approveTransaction(refNo: string): void {
    if (!confirm('Are you sure to approve this transaction?')) return;
    const tx = this.transactions().find(tx => tx.transaction_ref_no === refNo);
    if (!tx) return;

    this.walletService.updateTopupStatus(tx.requestid!, 'Approved').subscribe({
      next: () => {
        this.fetchTransactions(); // Refresh the transaction list
        // You might also want to re-fetch dealer balances here if approval changes it
        // this.walletService.getAllDealerWithBalance().subscribe(data => this.dealerBalances.set(data));
      },
      error: err => console.error('Failed to approve transaction:', err)
    });
  }

  // Reject a pending transaction
  rejectTransaction(refNo: string): void {
    if (!confirm('Are you sure to reject this transaction?')) return;
    const tx = this.transactions().find(tx => tx.transaction_ref_no === refNo);
    if (!tx) return;

    this.walletService.updateTopupStatus(tx.requestid!, 'Rejected').subscribe({
      next: () => {
        this.fetchTransactions(); // Refresh the transaction list
      },
      error: err => console.error('Failed to reject transaction:', err)
    });
  }
}