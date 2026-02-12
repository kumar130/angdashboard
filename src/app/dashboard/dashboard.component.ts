import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TagRule {
  key: string;
  allowedValues: string[];
  compliance?: number;
  nonCompliant?: any[];
  expanded?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalResources = 0;
  csvRows: any[] = [];

  // User input model
  newTagKey = '';
  newTagValues = '';

  tagRules: TagRule[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(csv => this.parseCSV(csv));
  }

  parseCSV(data: string) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i]) continue;

      const values = rows[i].split(',');
      const row: any = {};

      headers.forEach((h, idx) => {
        row[h.trim()] = values[idx]?.trim();
      });

      this.csvRows.push(row);
    }

    this.totalResources = this.csvRows.length;
  }

  addRule() {
    if (!this.newTagKey || !this.newTagValues) return;

    this.tagRules.push({
      key: this.newTagKey.trim(),
      allowedValues: this.newTagValues.split(',').map(v => v.trim()),
      compliance: 0,
      nonCompliant: [],
      expanded: false
    });

    this.newTagKey = '';
    this.newTagValues = '';
  }

  evaluateCompliance() {

    this.tagRules.forEach(rule => {

      let validCount = 0;
      rule.nonCompliant = [];

      this.csvRows.forEach(row => {
        const value = row[rule.key];

        if (value && rule.allowedValues.includes(value)) {
          validCount++;
        } else {
          rule.nonCompliant!.push({
            resource: row['resourceId'] || row['resource'] || 'UNKNOWN',
            value: value || 'MISSING'
          });
        }
      });

      rule.compliance = Math.round(
        (validCount / this.totalResources) * 100
      );
    });
  }

  toggle(rule: TagRule) {
    rule.expanded = !rule.expanded;
  }
}
