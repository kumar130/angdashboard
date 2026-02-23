import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TagRule {
  key: string;
  value: string;
}

export interface ResourceRow {
  accountId: string;
  resourceId: string;
  tags: Record<string, string>;
  compliance?: 'COMPLIANT' | 'NON_COMPLIANT';
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

  getRules() {
    return this.rules;
  }

  /**
   * Load CSV from assets folder
   */
  loadCsv(): Observable<ResourceRow[]> {
    return this.http
      .get('assets/tag-report.csv', { responseType: 'text' })
      .pipe(map(text => this.parseCsv(text)));
  }

  /**
   * CSV parser
   */
  private parseCsv(text: string): ResourceRow[] {
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const cols = line.split(',');

      const row: any = {};
      headers.forEach((h, i) => {
        row[h] = cols[i]?.trim();
      });

      const tags: Record<string, string> = {};

      Object.keys(row).forEach(k => {
        if (k.startsWith('tag:')) {
          tags[k.replace('tag:', '')] = row[k];
        }
      });

      return {
        accountId: row['accountId'] || row['AccountId'] || '',
        resourceId: row['resourceId'] || row['ResourceId'] || '',
        tags
      };
    });
  }

  /**
   * Compliance calculation
   */
  calculateCompliance(resources: ResourceRow[]): ResourceRow[] {

    if (!this.rules.length) return resources;

    return resources.map(r => {

      const compliant = this.rules.every(rule => {
        return r.tags?.[rule.key] === rule.value;
      });

      return {
        ...r,
        compliance: compliant ? 'COMPLIANT' : 'NON_COMPLIANT'
      };
    });
  }
}
