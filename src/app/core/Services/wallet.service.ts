import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TopupRequest {
  requestid?: number;
  userid?: number;
  amount: number;
  payment_mode: string;
  payment_proof_url: string;
  transaction_ref_no: string;
  transaction_date: string;
  submit_date?: string;
  update_date?: string;
  status?: string;
  admin_comment?: string;
  dealer_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  private apiUrl = `${environment.apiUrl}/wallet`; // Adjust to match your backend route
  
  constructor(private http: HttpClient) {}
  
  getDealerBalance(dealerName: string) {
    return this.http.get<{ balance: number }>(`${this.apiUrl}/dealer/${dealerName}/balance`);
  }

  getAllDealerWithBalance() {
    var dealers$ = this.http.get<{ dealers: { name: string; balance: number }[] }>(`${this.apiUrl}/dealer/all/balances`);
    dealers$.subscribe(data => console.log("Fetched dealer balances:", data));  
    return dealers$;
  }

  getBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.apiUrl}/balance`);
  }

  getTransactions(filters?: {
    status?: string;
    transaction_ref_no?: string;
  }): Observable<TopupRequest[] | { transactions: TopupRequest[] }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set("status", filters.status);
      if (filters.transaction_ref_no) params = params.set("transaction_ref_no", filters.transaction_ref_no);
    }
    return this.http.get<TopupRequest[] | { transactions: TopupRequest[] }>(`${this.apiUrl}/requests`, { params });
  }

  submitTopupRequest(request: {
    amount: number;
    payment_mode: string;
    payment_proof: File;
    transaction_ref_no: string;
    transaction_date: string;
  }): Observable<any> {
    const formData = new FormData();
    formData.append("amount", request.amount.toString());
    formData.append("payment_mode", request.payment_mode);
    formData.append("payment_proof_url", request.payment_proof, request.payment_proof.name);
    formData.append("transaction_ref_no", request.transaction_ref_no);
    formData.append("transaction_date", request.transaction_date);

    return this.http.post(`${this.apiUrl}/topup`, formData);
  }

  // For admin use: update request status (approve/reject)
  updateTopupStatus(requestId: number, status: string, adminComment?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/requests/${requestId}`, { status, admin_comment: adminComment });
  }
}