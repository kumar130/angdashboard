import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-report',
  standalone: true,
  template: `
  <div style="padding:20px">

    <h2>AWS Tagging Compliance Dashboard</h2>

    <h3 style="margin-top:20px">Configure Tags</h3>

    <div *ngFor="let tag of requiredTags; let i = index" style="margin-bottom:10px">
      <input placeholder="Key"
             [(ngModel)]="tag.key"
             style="margin-right:10px"/>
      <input placeholder="Value (comma separated)"
             [(ngModel)]="tag.value"
             style="margin-right:10px"/>
      <button (click)="removeTag(i)">Remove</button>
    </div>

    <button (click)="addTag()">Add Tag</button>
    <button (click)="generateReport()" style="margin-left:10px">
      Generate Report
    </button>

    <div *ngIf="summary" style="margin-top:30px">
      <h3>Overall Summary</h3>
      <p>Total Resources: {{summary.total}}</p>
      <p>Compliant: {{summary.compliant}}</p>
      <p>Non-Compliant: {{summary.nonCompliant}}</p>
      <p><b>Compliance %: {{summary.percentage}}%</b></p>
    </div>

    <div *ngFor="let group of groupedResults" style="margin-top:20px">

      <h3 (click)="group.expanded = !group.expanded"
          style="cursor:pointer">
        {{group.type}}
        (Total: {{group.total}},
         Failed: {{group.failed}},
         {{group.percentage}}%)
      </h3>

      <div *ngIf="group.expanded">

        <div *ngFor="let res of group.resources"
             style="margin-left:20px;margin-bottom:10px">

          <div *ngIf="res.failures.length > 0">

            <div (click)="res.expanded = !res.expanded"
                 style="cursor:pointer">
              ▼ {{res.name}}
            </div>

            <div *ngIf="res.expanded"
                 style="margin-left:20px;color:red">

              <div *ngFor="let f of res.failures">
                - {{f.key}} expected {{f.expected}},
                  actual {{f.actual}}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
  `
})
export class ReportComponent implements OnInit {

  private http = inject(HttpClient);

  rows: any[] = [];
  requiredTags: any[] = [{ key: '', value: '' }];
  groupedResults: any[] = [];
  summary: any;

  ngOnInit() {

    this.http
      .get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(csv => {

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          delimiter: '', // auto detect (tab or comma)
          transformHeader: (h: string) =>
            h.trim().toLowerCase(),
          complete: (result) => {
            this.rows = result.data;
          }
        });

      });

  }

  addTag() {
    this.requiredTags.push({ key: '', value: '' });
  }

  removeTag(index: number) {
    this.requiredTags.splice(index, 1);
  }

  generateReport() {

    if (!this.rows.length) return;

    const groups: any = {};
    let totalResources = 0;
    let totalCompliant = 0;

    this.rows.forEach((r: any) => {

      const resourceType =
        (r['resourcetype'] || 'Unknown').toString().trim();

      const resourceName =
        r['name']?.trim() ||
        r['resourcearn']?.split('/').pop() ||
        'Unknown';

      const failures: any[] = [];

      this.requiredTags.forEach((t: any) => {

        if (!t.key || !t.value) return;

        const key = t.key.trim().toLowerCase();

        const expectedValues = t.value
          .split(',')
          .map((v: string) =>
            v.trim().toLowerCase()
          );

        const actual = (r[key] || '')
          .toString()
          .trim()
          .toLowerCase();

        if (!expectedValues.includes(actual)) {
          failures.push({
            key: t.key,
            expected: t.value,
            actual: actual || 'Missing'
          });
        }

      });

      if (!groups[resourceType]) {
        groups[resourceType] = {
          type: resourceType,
          resources: [],
          total: 0,
          failed: 0,
          compliant: 0,
          percentage: 0,
          expanded: false
        };
      }

      groups[resourceType].total++;
      totalResources++;

      if (failures.length === 0) {
        groups[resourceType].compliant++;
        totalCompliant++;
      } else {
        groups[resourceType].failed++;
      }

      groups[resourceType].resources.push({
        name: resourceName,
        failures: failures,
        expanded: false
      });

    });

    Object.values(groups).forEach((g: any) => {
      g.percentage =
        g.total === 0
          ? 0
          : Math.round((g.compliant / g.total) * 100);
    });

    this.groupedResults = Object.values(groups);

    this.summary = {
      total: totalResources,
      compliant: totalCompliant,
      nonCompliant: totalResources - totalCompliant,
      percentage:
        totalResources === 0
          ? 0
          : Math.round(
              (totalCompliant / totalResources) * 100
            )
    };

  }

}