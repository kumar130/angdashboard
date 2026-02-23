import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  compliant = 0;
  nonCompliant = 0;
  resources: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCsv();
  }

  loadCsv() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => this.parseCsv(data));
  }

  // ✅ Proper CSV parser (handles quotes + commas)
  parseCsv(csv: string) {

    const rows = this.csvToArray(csv);

    if (rows.length === 0) return;

    const headers = rows[0];

    this.resources = [];
    this.compliant = 0;
    this.nonCompliant = 0;

    for (let i = 1; i < rows.length; i++) {

      const rowObj: any = {};
      headers.forEach((h, idx) => rowObj[h] = rows[i][idx]);

      const arn = rowObj['Resource ARN'] || '';
      const resourceType = rowObj['Resource Type'] || '';
      const compliance =
        rowObj['Compliance Status'] ||
        rowObj['Compliance'] ||
        '';

      const resourceId = this.extractResourceId(arn);

      const isCompliant =
        compliance.toLowerCase().includes('compliant');

      if (isCompliant) this.compliant++;
      else this.nonCompliant++;

      this.resources.push({
        resourceId,
        resourceType,
        compliant: isCompliant
      });
    }
  }

  // ✅ Extract resource id from ARN
  extractResourceId(arn: string): string {

    if (!arn) return 'Unknown';

    const parts = arn.split('/');
    return parts[parts.length - 1] || arn;
  }

  // ✅ CSV → Array parser supporting quotes
  csvToArray(text: string): string[][] {

    const rows: string[][] = [];
    let row: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {

      const char = text[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === ',' && !insideQuotes) {
        row.push(current);
        current = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !insideQuotes) {
        if (current || row.length) {
          row.push(current);
          rows.push(row);
          row = [];
          current = '';
        }
        continue;
      }

      current += char;
    }

    if (current || row.length) {
      row.push(current);
      rows.push(row);
    }

    return rows;
  }
}
