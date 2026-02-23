import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TagRule {
  key: string;
  value: string;
}

export interface ResourceRecord {
  resourceId: string;
  resourceType: string;
  compliance: 'COMPLIANT' | 'NON_COMPLIANT';
}

@Injectable({ providedIn: 'root' })
export class TagConfigService {

  private csvPath = 'assets/tag-report.csv';

  constructor(private http: HttpClient) {}

  private rules: TagRule[] = [];

  setRules(rules: TagRule[]) {
    this.rules = rules;
  }

  getRules() {
    return this.rules;
  }

  loadCsv(): Observable<any[]> {
    return this.http.get(this.csvPath, { responseType: 'text' }).pipe(
      map(text => this.parseCsv(text))
    );
  }

  private parseCsv(csv: string): any[] {
    const lines = csv.split('\n').filter(l => l.trim().length > 0);

    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',');

      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });

      return obj;
    });
  }

  calculateCompliance(data: any[]): ResourceRecord[] {

    return data.map(row => {

      const arn: string = row['ResourceArn'] || '';

      const resourceId =
        arn.split('/').pop() ||
        arn.split(':').pop() ||
        'Unknown';

      const resourceType = row['ResourceType'] || 'Unknown';

      let compliant = true;

      for (const rule of this.rules) {
        const val = row[rule.key] || '';
        if (!val || val !== rule.value) {
          compliant = false;
          break;
        }
      }

      return {
        resourceId,
        resourceType,
        compliance: compliant ? 'COMPLIANT' : 'NON_COMPLIANT'
      };
    });
  }
}
