import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallet`; // Adjust to match your backend route

  constructor(private http: HttpClient) {}

  // Get wallet balance
  getBalance(): Observable<{ balance: number }> {

       console.log('Getting wallet balance from', this.http.get<{ balance: number }>(`${this.apiUrl}/balance`));
       return this.http.get<{ balance: number }>(`${this.apiUrl}/balance`);
  }

  // Top up wallet (can use FormData if supporting file uploads)
  topup(formData?: FormData): Observable<any> {
    console.log('Topping up wallet with', { formData });
    if (formData) {
      // For file uploads with the top-up

     //  formData.append('transactionDate', String(formData.get('transactionDate')));
     //  formData.append('transactionRefNo', String(formData.get('transactionRefNo')));
     //  formData.append('paymentMode', String(formData.get('paymentMode')));
     //  formData.append('amount', String(formData.get('amount')));
     //  formData.append('paymentProof', String(formData.get('paymentProof')));
     //  formData.append('status', 'Pending');
     //  formData.append('updateDate', String(formData.get('updateDate')));
 //formdata to json

     //  const jsonData: Record<string, FormDataEntryValue> = {};
     //  formData.forEach((value, key) => {
     //    jsonData[key] = value;
     //  });
     //  return this.http.post(`${this.apiUrl}/topup`, jsonData);
      return this.http.post(`${this.apiUrl}/topup`, formData);

    } else {
      // Simple top-up
      return this.http.post(`${this.apiUrl}/topup`, formData);
    }
  }

  // Deduct from wallet
  deduct(amount: number, reference?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deduct`, { amount, reference });
  }

  // Fetch all wallet transactions
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`);
  }
}
