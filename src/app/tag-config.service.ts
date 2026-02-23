import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Resource {
  accountId: string;
  tags: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  requiredTags: Record<string, string> = {};

  constructor(private http: HttpClient) {}

  setRequiredTags(tags: Record<string, string>) {
    this.requiredTags = tags;
  }

  loadCsv(): Observable<Resource[]> {

    return this.http
      .get('assets/tag-report.csv', { responseType: 'text' })
      .pipe(map(csv => this.parseCsv(csv)));
  }

  private parseCsv(csv: string): Resource[] {

    const lines = csv.split('\n');
    const header = lines[0].split(',');

    const resources: Resource[] = [];

    for (let i = 1; i < lines.length; i++) {

      if (!lines[i].trim()) continue;

      const values = lines[i].split(',');

      const obj: any = {};

      header.forEach((h, idx) => {
        obj[h.trim()] = values[idx]?.trim();
      });

      const tags: Record<string, string> = {};

      Object.keys(obj).forEach(key => {
        if (key.startsWith('tag:')) {
          tags[key.replace('tag:', '')] = obj[key];
        }
      });

      resources.push({
        accountId: obj['accountId'] || obj['AccountId'],
        tags
      });
    }

    return resources;
  }

  calculateCompliance(resources: Resource[]) {

    return resources.map(r => {

      let compliant = true;

      for (const key of Object.keys(this.requiredTags)) {

        if (r.tags[key] !== this.requiredTags[key]) {
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
