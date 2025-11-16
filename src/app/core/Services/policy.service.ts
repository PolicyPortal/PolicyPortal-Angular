import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../../dealer/view-policies/view-policies';
import { PolicyAtAdmin } from '../../admin/admin-dashboard/admin-dashboard';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);
  
  private serviceApiUrl = `${environment.apiUrl}/policies`;
  // private apiUrl = 'http://localhost:5001/api/policies'; 

  getAllPolicies(): Observable<PolicyAtAdmin[]> {
    return this.http.get<PolicyAtAdmin[]>(this.serviceApiUrl);
  }

  getPoliciesByDealer(dealerId: number): Observable<Policy[]> {
    const url = `${this.serviceApiUrl}/dealer/${dealerId}`;
    return this.http.get<Policy[]>(url);
  }

  

getDashboardCounts() {
  return this.http.get<{
    todayPolicies: number;
    monthPolicies: number;
    yearPolicies: number;
    totalEarning: number;
    monthEarning: number;
  }>(`${this.serviceApiUrl}/dashboard-counts`);
}

}