import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
// --- Interfaces (Exported for component use) ---
export interface User {
  uid: string;
  name: string;
  role: 'Admin' | 'Dealer';
}

export interface Invoice {
  invoiceid: number; // This will be tricky with Firestore, consider using Firestore ID
  dealerid: string;
  dealername: string;
  invoicemonthyear: string;
  netbusiness: number;
  payout: number;
  netPayout: number;
  claimedPayout: number;
  unClaimedPayout: number;
  igst: number;
  invoicenumber: string;
  status: 'Sent to Dealer' | 'Submitted by Dealer';
  adminsubmissiondate: string; // ISO string
  dealersubmissiondate: string | null; // ISO string
  invoicepdfpath: string | null;
}

export interface AdminFormState {
  dealerId: string;
  month: string;
  year: string;
  netBusiness: string;
  payout: string;
  igst: string;
  invoiceNumber: string;
}

export interface AdminSubmitEvent extends AdminFormState {
  dealerName: string;
}


@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  // --- API Base URLs ---
  private invoicesApiUrl = `${environment.apiUrl}/invoices`;
//   private dealersApiUrl = `${environment.apiUrl}/dealers`;

  // --- HTTP Client ---
  private http = inject(HttpClient);

  constructor() { }

  
 

  /**
   * Gets all invoices from the backend.
   * Note: Sorting will need to be done in the component.
   */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.invoicesApiUrl}`).pipe(
      catchError(err => {
        console.error('Error fetching invoices:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Gets a single invoice by its ID.
   */
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoicesApiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Error fetching invoice ${id}:`, err);
        return throwError(() => err);
      })
    );
  }


  // --- CRUD Methods ---

  /**
   * Posts a new invoice to the backend.
   */
  addInvoice(event: AdminSubmitEvent): Observable<Invoice> {
    
    // Create the new invoice object
    const newInvoicePayload = {
      dealerid: event.dealerId,
      dealername: event.dealerName,
      invoicemonthyear: `${event.month}/${event.year}`,
      netbusiness: parseFloat(event.netBusiness) || 0,
      payout: parseFloat(event.payout) || 0,
      netPayout: (parseFloat(event.netBusiness) || 0) * 0.9, // Example
      claimedPayout: (parseFloat(event.payout) || 0) * 0.6, // Example
      unClaimedPayout: (parseFloat(event.payout) || 0) * 0.4, // Example
      igst: parseFloat(event.igst) || 0,
      invoicenumber: event.invoiceNumber,
      status: 'Sent to Dealer' as const, // Ensure type safety
      adminsubmissiondate: new Date().toISOString(),
      dealersubmissiondate: null,
      invoicepdfpath: null,
    };

    return this.http.post<Invoice>(this.invoicesApiUrl, newInvoicePayload).pipe(
      catchError(err => {
        console.error('Service: Error adding invoice:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Updates an existing invoice.
   */
  updateInvoice(id: number, invoiceData: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.invoicesApiUrl}/${id}`, invoiceData).pipe(
      catchError(err => {
        console.error(`Error updating invoice ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Deletes an invoice.
   */
  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.invoicesApiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Error deleting invoice ${id}:`, err);
        return throwError(() => err);
      })
    );
  }
}