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

  private rules: TagRule[] = [];

  constructor(private http: HttpClient) {}

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

  /**
   * Robust CSV parser supporting quotes and commas inside values
   */
  private parseCsv(csv: string): any[] {

    const lines = csv
      .replace(/\r/g, '')
      .split('\n')
      .filter(l => l.trim().length > 0);

    if (lines.length === 0) return [];

    const headers = this.parseLine(lines[0]).map(h => h.trim());

    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {

      const values = this.parseLine(lines[i]);

      const obj: any = {};

      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });

      rows.push(obj);
    }

    console.log('CSV SAMPLE ROW:', rows[0]); // debug

    return rows;
  }

  /**
   * Parse single CSV line with quotes support
   */
  private parseLine(line: string): string[] {

    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === ',' && !insideQuotes) {
        result.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    result.push(current);

    return result.map(v => v.trim());
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

      // If no rules configured → treat as compliant
      if (this.rules.length > 0) {
        for (const rule of this.rules) {
          const val = row[rule.key] || '';
          if (!val || val !== rule.value) {
            compliant = false;
            break;
          }
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
