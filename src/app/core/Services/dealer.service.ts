import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Dealer {
  dealer_id: number;
  Name: string;
  Role: string;
  Email: string;
  Password: string;
  Phone: string;
  Location: string;
  Status: 'Active' | 'Inactive';
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

     addDealer(newDealerData: { Name: string; Role: string; Email: string; Phone: string; Location: string; Status: 'Active' | 'Inactive'; Password: string; }): Observable<Dealer> {
          return this.authService.register(newDealerData);
     }

}