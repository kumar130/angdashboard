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

    <!-- OVERALL SUMMARY -->
    <div style="padding:15px; border:1px solid #ccc; margin-bottom:20px;">
      <h3>Overall Summary</h3>
      <p><strong>Total Resources:</strong> {{ total }}</p>
      <p><strong>Compliant:</strong> {{ passed }}</p>
      <p><strong>Non-Compliant:</strong> {{ failedCount }}</p>
      <p><strong>Compliance %:</strong> {{ overallPercentage }}%</p>
    </div>

    <!-- PER RESOURCE TYPE -->
    <div *ngFor="let type of typeStats | keyvalue">

      <div style="padding:10px; border:1px solid #ddd; margin-bottom:10px;">
        <h3>{{ type.key }}</h3>

        <p><strong>Total:</strong> {{ type.value.total }}</p>
        <p><strong>Compliant:</strong> {{ type.value.passed }}</p>
        <p><strong>Non-Compliant:</strong> {{ type.value.failed }}</p>
        <p><strong>Compliance %:</strong> {{ type.value.percentage }}%</p>
      </div>

      <!-- Failed resources list -->
      <div *ngIf="failed[type.key]">
        <div *ngFor="let r of failed[type.key]">
          <strong>{{ r.displayName }}</strong>
          <div *ngFor="let f of r.failures">
            - {{ f.key }} expected {{ f.expected }}, actual {{ f.actual }}
          </div>
          <hr>
        </div>
      </div>

    </div>
  `
})
export class ReportComponent implements OnInit {

  failed: any = {};
  typeStats: any = {};

  total = 0;
  passed = 0;
  failedCount = 0;
  overallPercentage = 0;

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
            this.total = rows.length;

            rows.forEach((r: any) => {

              const type = r['ResourceType']?.trim() || 'Unknown';

              if (!this.typeStats[type]) {
                this.typeStats[type] = {
                  total: 0,
                  passed: 0,
                  failed: 0,
                  percentage: 0
                };
              }

              this.typeStats[type].total++;

              let displayName = r['Name'];
              if (!displayName && r['ResourceArn']) {
                const parts = r['ResourceArn'].split('/');
                displayName = parts[parts.length - 1];
              }

              let failures: any[] = [];

              required.forEach((t: any) => {

                const key = t.key.trim().toLowerCase();
                const expected = t.value.trim().toLowerCase();

                // Find matching column dynamically (case insensitive)
                const column = Object.keys(r).find(
                  k => k.trim().toLowerCase() === key
                );

                const actual = column ? (r[column] || '').trim().toLowerCase() : '';

                if (actual !== expected) {
                  failures.push({
                    key: t.key,
                    expected: t.value,
                    actual: actual || 'Missing'
                  });
                }

              });

              if (failures.length > 0) {

                this.failedCount++;
                this.typeStats[type].failed++;

                if (!this.failed[type]) {
                  this.failed[type] = [];
                }

                this.failed[type].push({
                  displayName,
                  failures
                });

              } else {
                this.passed++;
                this.typeStats[type].passed++;
              }
            });

            // Overall %
            this.overallPercentage =
              this.total > 0
                ? Math.round((this.passed / this.total) * 100)
                : 0;

            // Per Type %
            Object.keys(this.typeStats).forEach(type => {
              const stats = this.typeStats[type];
              stats.percentage =
                stats.total > 0
                  ? Math.round((stats.passed / stats.total) * 100)
                  : 0;
            });
          }
        });
      });
  }
}