import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TagRule {
  key: string;
  value: string;
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

  // LOAD CSV FROM ASSETS
  loadCsv(): Observable<any[]> {
    return this.http
      .get('assets/tag-report.csv', { responseType: 'text' })
      .pipe(map(text => this.parseTSV(text)));
  }

  // PARSE TAB SEPARATED FILE
  private parseTSV(text: string): any[] {
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    return lines.map(line => {
      const cols = line.split('\t');

      return {
        accountId: cols[0] || '',
        accountName: cols[1] || '',
        region: cols[2] || '',
        service: cols[3] || '',
        arn: cols[4] || '',
        resourceName: cols[10] || '',
        ownerEmail: cols[22] || '',
        ownerName: cols[23] || '',
        compliance: 'UNKNOWN'
      };
    });
  }

  // CALCULATE COMPLIANCE
  calculateCompliance(resources: any[]): any[] {
    const rules = this.rules;

    return resources.map(res => {
      let compliant = true;

      rules.forEach(rule => {
        const value = (res.resourceName || '').toLowerCase();

        if (!value.includes(rule.value.toLowerCase())) {
          compliant = false;
        }
      });

      return {
        ...res,
        compliance: compliant ? 'COMPLIANT' : 'NON_COMPLIANT'
      };
    });
  }
}
