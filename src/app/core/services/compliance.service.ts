import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComplianceResponse } from '../models/compliance.model';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  baseUrl = 'https://s3.amazonaws.com/aws-tag-summaries';

  constructor(private http: HttpClient) {}

  getCompliance(accountId: string): Observable<ComplianceResponse> {
    return this.http.get<ComplianceResponse>(
      `${this.baseUrl}/${accountId}/latest/summary.json`
    );
  }
}