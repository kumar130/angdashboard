import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TagRule {
  key: string;
  value: string;
}

export interface ResourceResult {
  accountId: string;
  resourceId: string;
  resourceType: string;
  compliance: 'COMPLIANT' | 'NON_COMPLIANT';
}

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  private rules: TagRule[] = [];

  constructor(private http: HttpClient) {}

  setRules(rules: TagRule[]) {
    this.rules = rules;
  }

  getRules(): TagRule[] {
    return this.rules;
  }

  loadCsv(): Observable<any[]> {
    return this.http
      .get('assets/tag-report.csv', { responseType: 'text' })
      .pipe(map(text => this.parseCsv(text)));
  }

  private parseCsv(text: string): any[] {

    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const headers = lines[0].split(',').map(h => h.trim());

    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {

      const cols = lines[i].split(',');

      const obj: any = {};

      headers.forEach((h, idx) => {
        obj[h] = cols[idx] ? cols[idx].trim() : '';
      });

      rows.push(obj);
    }

    return rows;
  }

  private extractResourceId(arn: string): string {

    if (!arn) return '';

    const parts = arn.split('/');
    return parts[parts.length - 1] || arn;
  }

  calculateCompliance(resources: any[]): ResourceResult[] {

    const results: ResourceResult[] = [];

    for (const r of resources) {

      let compliant = true;

      for (const rule of this.rules) {

        const key = rule.key.toLowerCase();
        const value = rule.value.toLowerCase();

        const columnName = Object.keys(r).find(
          k => k.toLowerCase() === key
        );

        if (!columnName) {
          compliant = false;
          break;
        }

        const actualValue = (r[columnName] || '').toString().toLowerCase();

        if (!actualValue.includes(value)) {
          compliant = false;
          break;
        }
      }

      const arn = r['ResourceArn'] || '';

      results.push({
        accountId: r['AccountId'] || '',
        resourceId: this.extractResourceId(arn),
        resourceType: r['ResourceType'] || 'UNKNOWN',
        compliance: compliant ? 'COMPLIANT' : 'NON_COMPLIANT'
      });
    }

    return results;
  }
}
