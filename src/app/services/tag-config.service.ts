import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Rule {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  private rules: Rule[] = [];

  constructor(private http: HttpClient) {}

  setRules(rules: Rule[]) {
    this.rules = rules;
  }

  getRules(): Rule[] {
    return this.rules;
  }

  loadCsv(): Observable<any[]> {
    return this.http.get('assets/data.csv', { responseType: 'text' }).pipe(
      map(text => this.parseTSV(text))
    );
  }

  private parseTSV(data: string): any[] {

    const lines = data.split('\n').filter(l => l.trim().length > 0);

    return lines.map(line => {
      const cols = line.split('\t');   // ⭐ TAB separated

      return {
        accountId: cols[0],
        accountName: cols[1],
        region: cols[2],
        service: cols[3],
        resourceArn: cols[4],
        name: cols[6] || '',
        product: cols[15] || '',
        environment: cols[16] || '',
        ownerEmail: cols[22] || ''
      };
    });
  }

  calculateCompliance(resources: any[]) {

    const rules = this.rules;

    return resources.map(r => {

      let compliant = true;

      for (const rule of rules) {
        const value = (r[rule.key] || '').toLowerCase();

        if (!value.includes(rule.value.toLowerCase())) {
          compliant = false;
          break;
        }
      }

      return {
        ...r,
        compliance: compliant ? 'COMPLIANT' : 'NON_COMPLIANT'
      };
    });
  }
}
