import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Dealer {
  user_id: number;
  name: string;
  role: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
}


@Injectable({
     providedIn: 'root'
})
export class DealerService {

     private serviceApiUrl = `${environment.apiUrl}/dealers`;

     constructor(private http: HttpClient, private authService: AuthService) { }

     getDealers(): Observable<Dealer[]> {
     return this.http.get<Dealer[]>(`${this.serviceApiUrl}/alldealers`);
     }

     getDealerById(id: number): Observable<Dealer | undefined> {
     return this.http.get<Dealer>(`${this.serviceApiUrl}/dealers/${id}`);
     }

     addDealer(newDealerData: { name: string; role: string; email: string; phone: string; location: string; status: 'Active' | 'Inactive'; password: string; }): Observable<Dealer> {
          return this.authService.register(newDealerData);
     }

     updateDealer(dealer: Dealer): Observable<void> {
     return this.http.put<void>(`${this.serviceApiUrl}/updatedealer/${dealer.user_id}`, dealer);
     }

     deleteDealer(id: number): Observable<void> {
     return this.http.delete<void>(`${this.serviceApiUrl}/deletedealer/${id}`);
     }

}