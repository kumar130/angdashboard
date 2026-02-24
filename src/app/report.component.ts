import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          delimiter: '',
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

  this.requiredTags.forEach((t: any) => {

    if (!t.key || !t.value) return;

    const key = t.key; // DO NOT lowercase
    const expectedValues = t.value
      .split(',')
      .map((v: string) => v.trim());

    // STRICT: exact column match only
    const actual = r[key];

    if (!actual || !expectedValues.includes(actual)) {
      failures.push({
        key: key,
        expected: t.value,
        actual: actual ? actual : 'Missing'
      });
    }

  });

}