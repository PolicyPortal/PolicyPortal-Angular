// src/app/core/services/form-config.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormConfig } from '../models/form-control';

// 1. Import the environment object

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  // 2. Change the hardcoded URL to use the environment variable
  private apiUrl = `${environment.apiUrl}/form-configurations`;

  constructor(private http: HttpClient) { }

  getFormConfig(id: string): Observable<FormConfig> {
    return this.http.get<FormConfig>(`${this.apiUrl}/${id}`);
  }

  saveFormConfig(config: FormConfig): Observable<FormConfig> {
    return this.http.put<FormConfig>(`${this.apiUrl}/${config.id}`, config);
  }
}