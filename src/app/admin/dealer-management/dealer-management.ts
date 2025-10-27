import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { delay, Observable, of } from 'rxjs';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DealerService } from '../../core/Services/dealer.service';
import { AuthService } from '../../core/Services/auth.service';

// --- DATA INTERFACES ---

// Base interface provided by the (mock) service
export interface Dealer {
  user_id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
  password?: string; // Password should not be sent from the service
}

// Extended interface for the form, including all new fields
export interface ExpandedDealer extends Dealer {
  // [user_id, owner_name, owner_contact, oem, pan_number, aadhaar_number, 
  //       gst_number, bank_name, bank_branch, ifsc_code, pan_file_url, aadhaar_file_url, gst_file_url, status]
  owner_name: string;
  owner_contact: string;
  oem: string;
  pan_number: string;
  aadhaar_number: string;
  gst_number: string;
  bank_name: string;
  bank_branch: string;
  ifsc_code: string;
  payouts: {
    twoWheeler: {
      in: { [key: string]: number };
      out: { [key: string]: number };
    };
    car: {
      in: { [key: string]: number };
      out: { [key: string]: number };
    };
    commercial: {
      in: { [key: string]: number };
      out: { [key: string]: number };
    };
  };
  // File properties
  pan_file: File | null;
  aadhaar_file: File | null;
  gst_file: File | null;
}

// --- MOCK SERVICE ---
// A mock service to make the component runnable
// class DealerService1 {
//     private baseUrl = `${environment.apiUrl}`;

//   constructor(private http: HttpClient) {}

//   // Register/create dealer (usually POST to /auth/register)
//   addDealer(dealerData: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/auth/register`, dealerData);
//   }

//   // Get all dealers
//   getDealers(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/dealers/alldealers`);
//   }

//   // Update dealer
//   updateDealer(dealer: any): Observable<any> {
//     return this.http.put(`${this.baseUrl}/dealers/updatedealer/${dealer.user_id}`, dealer);
//   }

//   // Delete dealer
//   deleteDealer(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/dealers/deletedealer/${id}`);
//   }

//   // Get details by id
//   getDealerById(id: number): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/dealers/${id}`);
//   }
  
// }
@Component({
  selector: 'app-dealer-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss'
})
export class DealerManagement {
 // --- State Signals ---
  isPageReady = signal(false);
  dealers: WritableSignal<ExpandedDealer[]> = signal([]);
  selectedDealer: WritableSignal<ExpandedDealer | null> = signal(null); // For Edit/Add Form
  viewingDealer: WritableSignal<ExpandedDealer | null> = signal(null); // For Details Popup
  isEditing = signal(false);

  // --- Computed Signals ---
  isFormValid: Signal<boolean> = computed(() => {
    const dealer = this.selectedDealer();
    if (!dealer) return false;

    // Basic Info
    if (!dealer.name || !dealer.oem || !dealer.phone || !dealer.email || !dealer.location) return false;
    
    // Password (only for new)
    if (!this.isEditing() && !dealer.password) return false;

    // Owner Details
    if (!dealer.owner_name || !dealer.owner_contact || !dealer.pan_number || !dealer.aadhaar_number || !dealer.gst_number) return false;

    // Files (only for new)
    if (!this.isEditing() && (!dealer.pan_file || !dealer.aadhaar_file || !dealer.gst_file)) {
      return false;
    }

    // Bank Details
    if (!dealer.bank_name || !dealer.bank_branch || !dealer.ifsc_code) return false;

    // Payouts can be 0, so no check needed

    return true;
  });

  // --- Services ---
  // Inject mock service. In a real app, you'd provide this.
  // private dealerService = new DealerService(); // Using 'new' as it's a mock

  constructor(private dealerService: DealerService ,private authService: AuthService) {}

  // --- Lifecycle ---
  ngOnInit(): void {
    this.loadDealers();
    // Simulate page load readiness
    setTimeout(() => this.isPageReady.set(true), 500); 
  }

  // --- Data Methods ---
  loadDealers(): void {
    this.dealerService.getDealers().subscribe(data => {
      console.log('Dealers loaded:', data);
      this.dealers.set(data);
    });
  }

  // --- Event Handlers ---
  onAddNewDealer(): void {
    this.isEditing.set(false);
    this.selectedDealer.set({

      // [user_id, owner_name, owner_contact, oem, pan_number, aadhaar_number, 
      //   gst_number, bank_name, bank_branch, ifsc_code, pan_file_url, aadhaar_file_url, gst_file_url, status]

      user_id: 0, // Temporary ID
      name: '',
      role: 'Dealer', // Default role
      email: '',
      password: '',
      phone: '',
      location: '', // This will map to Dealership Address
      status: 'Active',
      
      // --- NEW FIELDS ---
      owner_name: '',
      owner_contact: '',
      oem: '',
      pan_number: '',
      aadhaar_number: '',
      gst_number: '',
      bank_name: '',
      bank_branch: '',
      ifsc_code: '',
      payouts: {
        twoWheeler: {
          in: { '0-150': 0, '150-350': 0, '350+': 0 },
          out: { '0-150': 0, '150-350': 0, '350+': 0 }
        },
        car: {
          in: { '0-150': 0, '150-350': 0, '350+': 0 },
          out: { '0-150': 0, '150-350': 0, '350+': 0 }
        },
        commercial: {
          in: { '0-150': 0, '150-350': 0, '350+': 0 },
          out: { '0-150': 0, '150-350': 0, '350+': 0 }
        }
      },
      pan_file: null,
      aadhaar_file: null,
      gst_file: null,
    });
  }

  onEdit(dealer: ExpandedDealer): void {
    this.isEditing.set(true);
    // Create a deep copy to avoid modifying the list directly
    this.selectedDealer.set(JSON.parse(JSON.stringify(dealer)));
  }

  onSave(): void {
    const currentDealer = this.selectedDealer();
    if (!currentDealer || !this.isFormValid()) {
      //show all invalid fields in the form
      console.log("invalid fields names:", Object.keys(currentDealer || {}).filter(key => {
        const value = (currentDealer as any)[key];
        return value === null || value === undefined || value === '';
      }));
      console.error("Form is invalid or no dealer selected.");
      return;
    }

    // In a real app, you would handle file uploads here,
    // get back URLs, and add them to the dealer object.
    console.log("File Upload Logic would go here...");
    
    if (this.isEditing()) {
      // Update existing dealer
      this.dealerService.updateDealer(currentDealer).subscribe(() => {
        this.resetForm();
        this.loadDealers();
      });

    } else {
      // Add new dealer
      const { user_id, ...newDealerData } = currentDealer;
      this.authService.addDealer(newDealerData).subscribe(() => {
        this.resetForm();
        this.loadDealers();
      });
    }
  }

  onDelete(id: number): void {
    // We should not use window.confirm
    // This is a placeholder for a custom modal confirmation
    const confirmed = true; // Bypassing confirmation
    if (confirmed) {
      this.dealerService.deleteDealer(id).subscribe(() => {
        this.loadDealers();
      });
    }
  }

  // --- Popup/Modal Controls ---

  closeModal(): void {
    this.resetForm();
  }
  
  onViewDetails(dealer: ExpandedDealer): void {
    this.viewingDealer.set(dealer);
  }

  closeDetailsModal(): void {
    this.viewingDealer.set(null);
  }

  // --- Form Signal Helpers ---

  /**
   * Generic helper to update a field in the selectedDealer signal.
   * Works for simple fields and deeply nested fields.
   */
  updateField(event: Event, ...path: (string | number)[]): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let value: string | number | null = target.value;

    if (target instanceof HTMLInputElement && target.type === 'number') {
      value = target.valueAsNumber;
      if (isNaN(value)) value = 0; // Default to 0 if invalid number
    }
    
    this.selectedDealer.update(dealer => {
      if (!dealer) return null;
      
      // Deep copy to ensure immutability and trigger change detection
      const newDealer = JSON.parse(JSON.stringify(dealer)); 
      
      let current = newDealer;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;

      return newDealer;
    });
  }

  /**
   * Handles file input changes
   */
  handleFile(event: Event, field: 'pan_file' | 'aadhaar_file' | 'gst_file'): void {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;

    if (file) {
      this.selectedDealer.update(dealer => {
        if (!dealer) return null;
        // Create a new object for immutability
        return {
          ...dealer,
          [field]: file
        };
      });
      console.log(this.selectedDealer());
    }
  }
  
  // --- Private Methods ---
  private resetForm(): void {
    this.selectedDealer.set(null);
    this.isEditing.set(false);
  }
}

