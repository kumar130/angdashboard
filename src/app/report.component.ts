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

    <div *ngFor="let type of failed | keyvalue">
      <h3>{{ type.key }}</h3>

      <div *ngFor="let r of type.value">
        <strong>{{ r.displayName }}</strong>

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

            rows.forEach((r: any) => {

              const type = r['ResourceType']?.trim() || 'Unknown';

              // ✅ Use Name if exists, else extract last part of ARN
              let displayName = r['Name'];

              if (!displayName && r['ResourceArn']) {
                const parts = r['ResourceArn'].split('/');
                displayName = parts[parts.length - 1];
              }

              let failures: any[] = [];

              required.forEach((t: any) => {

                const actual =
                  r[t.key] ||
                  r[t.key?.toLowerCase()] ||
                  r[t.key?.toUpperCase()] ||
                  r['environment'] ||
                  r['Environment'] ||
                  r['env'] ||
                  r['ghr:environment'];

                if ((actual || '').trim() !== t.value) {
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
                  displayName,
                  failures
                });
              }
            });
          }
        });
      });
  }
}