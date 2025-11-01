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

     constructor(private http: HttpClient) { }


  // Get all dealers
  getDealers(): Observable<any[]> {
     var dealers = this.http.get<any[]>(`${this.serviceApiUrl}/alldealers`);
     return dealers;
  }

  // Update dealer
  updateDealer(dealer: any): Observable<any> {
    return this.http.put(`${this.serviceApiUrl}/updatedealer/${dealer.id}`, dealer);
  }

  // Delete dealer
  deleteDealer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.serviceApiUrl}/deletedealer/${id}`);
  }

  // Get details by id
  // getDealerById(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.serviceApiUrl}/${id}`);
  // }
  

}