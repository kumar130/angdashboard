import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [CommonModule],
  template: `
    <h2>Compliance Report</h2>

    <div *ngIf="debug">
      <h3>DEBUG (First Row)</h3>
      <pre>{{ debug | json }}</pre>
      <hr>
    </div>

    <div *ngFor="let type of failed | keyvalue">
      <h3>{{ type.key }}</h3>

      <div *ngFor="let r of type.value">
        <strong>{{ r.id }}</strong>

        <div *ngFor="let f of r.failures">
          - {{ f.key }} expected {{ f.expected }}, actual {{ f.actual }}
        </div>

        <hr>
      </div>
    </div>
  `
})
export class ReportComponent implements OnInit {

  failed: any = {};
  debug: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {

    const required = JSON.parse(localStorage.getItem('requiredTags') || '[]');

    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => {

        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (res: any) => {

            const rows = res.data;

            // 👇 SHOW FIRST ROW FOR DEBUG
            this.debug = rows[0];

            rows.forEach((r: any) => {

              const type = r['ResourceType']?.trim() || 'Unknown';
              const id = r['ResourceArn']?.trim() || 'Unknown';

              let failures: any[] = [];

              required.forEach((t: any) => {

                const actual = r[t.key] || r[t.key?.toLowerCase()];

                if (actual !== t.value) {
                  failures.push({
                    key: t.key,
                    expected: t.value,
                    actual: actual || 'Missing'
                  });
                }
              });

              if (failures.length > 0) {

                if (!this.failed[type]) {
                  this.failed[type] = [];
                }

                this.failed[type].push({
                  id,
                  failures
                });
              }
            });
          }
        });
      });
  }
}