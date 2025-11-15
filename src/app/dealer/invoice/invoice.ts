import { Component, computed, signal } from '@angular/core';
import { AdminFormState, AdminSubmitEvent, Invoice, User } from '../../core/Services/invoice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss'
})
export class InvoiceComponent {

  public allInvoices = signal<Invoice[]>([]);
  public dealers = signal<User[]>([])
  public loading = signal<boolean>(false);
  // public allInvoices = this._allInvoices;
  // public dealers = this._dealers
  // public loading = this._loading;

  ngOnInit(): void {
    // Load initial data
    this.loadInitialData();
  }


  private loadInitialData(): void {
    // Simulate loading dealers and invoices from the service
    this.loading.set(true);
    setTimeout(() => {
      // Sample dealers
      this.dealers.set([
        { uid: 'd1', name: 'Apex Automotive', role: 'Dealer' },
        { uid: 'd2', name: 'Prestige Motors', role: 'Dealer' },
        { uid: 'd3', name: 'Sunrise Cars', role: 'Dealer' },
      ]); 
      // Sample invoices
      this.allInvoices.set([
        {
          invoiceid: 1001,
          dealerid: 'd1',
          dealername: 'Apex Automotive',
          invoicemonthyear: '10/2025',
          netbusiness: 50000,
          payout: 5000,
          netPayout: 4500,
          claimedPayout: 3000,
          unClaimedPayout: 1500,
          igst: 900,
          invoicenumber: 'INV-AA-1001',
          status: 'Submitted by Dealer',
          adminsubmissiondate: new Date('2025-10-05T10:00:00Z').toISOString(),
          dealersubmissiondate: new Date('2025-10-06T14:30:00Z').toISOString(),
          invoicepdfpath: null,
        }]);
      this.loading.set(false);
    }, 1000);
  }
  // --- Public Read-only Signals ---
  // public dealers = this._dealers.asReadonly();
  // public allInvoices = this._allInvoices.asReadonly();
  // public loading = this._loading.asReadonly();

  // --- Form State (from InvoiceManagement) ---
  adminForm: AdminFormState = this.getInitialFormState();

  // --- Computed State for Validation (from InvoiceManagement) ---
  isFormValid = computed(() => {
    const form = this.adminForm;
    return form.dealerId &&
           form.month &&
           form.year &&
           form.netBusiness &&
           form.payout &&
           form.igst &&
           form.invoiceNumber;
  });

  // --- Form Submission Logic (from InvoiceManagement & App) ---
  onFormSubmit(): void {
    if (!this.isFormValid()) {
      console.error('Form is invalid');
      return;
    }
    
    const formValue = this.adminForm;
    const dealer = this.dealers().find(d => d.uid === formValue.dealerId);
    
    const event: AdminSubmitEvent = {
      ...formValue,
      dealerName: dealer ? dealer.name : 'Unknown Dealer'
    };

    // Start loading
    this.loading.set(true);
    console.log('Component: Submitting invoice...', event);

    // Simulate API call delay
    setTimeout(() => {
      const newInvoice: Invoice = {
        invoiceid: Math.floor(Math.random() * 10000),
        dealerid: event.dealerId,
        dealername: event.dealerName,
        invoicemonthyear: `${event.month}/${event.year}`,
        netbusiness: parseFloat(event.netBusiness) || 0,
        payout: parseFloat(event.payout) || 0,
        netPayout: parseFloat(event.netBusiness) * 0.9 || 0, // Example calculation
        claimedPayout: parseFloat(event.payout) * 0.6 || 0, // Example calculation
        unClaimedPayout: parseFloat(event.payout) * 0.4 || 0, // Example calculation
        igst: parseFloat(event.igst) || 0,
        invoicenumber: event.invoiceNumber,
        status: 'Sent to Dealer',
        adminsubmissiondate: new Date().toISOString(),
        dealersubmissiondate: null,
        invoicepdfpath: null,
      };

      // Add the new invoice
      this.allInvoices.update((invoices) => [newInvoice, ...invoices]);

      // Stop loading
      this.loading.set(false);
      console.log('Component: Invoice added successfully.');

      // Reset the form
      this.resetForm();
    }, 1000);
  }

  // --- Helper Functions (from InvoiceManagement) ---
  private getInitialFormState(): AdminFormState {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();
    return {
      dealerId: '',
      month: currentMonth.toString(),
      year: currentYear.toString(),
      netBusiness: '',
      payout: '',
      igst: '',
      invoiceNumber: ''
    };
  }
  
  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'N-A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  public resetForm(): void {
    this.adminForm = this.getInitialFormState();
  }


  // Pagination state
  pageSize = signal(5);
  currentPage = signal(1);

  // --- COMPUTED SIGNALS ---


  /**
   * Calculates the total number of pages.
   */
  totalPages = computed(() => {
    return Math.ceil(this.allInvoices().length / this.pageSize());
  });

  /**
   * Slices the filtered policies for the current page.
   * This replaces the MatPaginator.
   */
  paginatedPolicies = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const policies = this.allInvoices();
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    return policies.slice(startIndex, endIndex);
  });

  /**
   * Creates the "Showing 1 to 10 of 50" text.
   */
  paginationInfo = computed(() => {
    const length = this.allInvoices().length;
    const size = this.pageSize();
    const page = this.currentPage();

    if (length === 0) {
      return `Showing 0 of 0 results`;
    }

    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${length} results`;
  });
  
  
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


