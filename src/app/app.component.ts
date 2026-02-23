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
      .subscribe({
        next: (data) => this.parseCsv(data),
        error: (err) => console.error('CSV Load Error', err)
      });
  }

  parseCsv(csv: string) {

    const lines = csv.split('\n').filter(l => l.trim() !== '');
    const headers = lines[0].split(',');

    const rows = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => obj[h.trim()] = cols[i]?.trim());
      return obj;
    });

    this.resources = rows.map(r => {

      const arn = r['Resource ARN'] || r['ARN'] || '';
      const resourceId = arn.split('/').pop();

      const compliance =
        (r['Compliance'] || r['Status'] || '').toLowerCase();

      const isCompliant =
        compliance.includes('compliant') ||
        compliance === 'true';

      if (isCompliant) this.compliant++;
      else this.nonCompliant++;

      return {
        resourceId,
        resourceType: r['Resource Type'] || 'Unknown',
        compliant: isCompliant
      };
    });

    console.log('Parsed Resources:', this.resources);
  }
}
