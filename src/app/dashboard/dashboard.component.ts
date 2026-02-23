import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../services/tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  rules: any[] = [];
  results: any[] = [];

  constructor(private configService: TagConfigService) {}

  async ngOnInit() {

    this.rules = this.configService.getRules();

    if (!this.rules.length) return;

    const response = await fetch('assets/tag-report.csv');
    const text = await response.text();

    this.processCSV(text);
  }

  processCSV(csv: string) {

    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    const rows = lines.slice(1).map(line => line.split(','));

    this.rules.forEach(rule => {

      const keyIndex = headers.findIndex(h =>
        h.toLowerCase().includes(rule.key.toLowerCase())
      );

      if (keyIndex === -1) return;

      let compliant = 0;
      let total = 0;
      let failures: any[] = [];

      rows.forEach(row => {

        if (!row.length) return;

        total++;

        const value = row[keyIndex]?.trim();

        if (rule.values.includes(value)) {
          compliant++;
        } else {

          failures.push({
            resource: this.extractName(row[0]),
            actual: value || 'MISSING'
          });

        }

      });

      const percent = total
        ? Math.round((compliant / total) * 100)
        : 0;

      this.results.push({
        key: rule.key,
        percent,
        failures
      });

    });

  }

  extractName(arn: string) {

    if (!arn) return 'UNKNOWN';

    const parts = arn.split('/');
    return parts[parts.length - 1];
  }

}
