import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  
  
  private serviceApiUrl = `${environment.apiUrl}/`;

  constructor(private http: HttpClient) {}


  // private apiUrl = 'http://localhost:5001/api/getAllfinancer';

  getAllFinancer(): Observable<any> {
    return this.http.get<any>(this.serviceApiUrl + 'financers/getAllfinancer');
  }
}


