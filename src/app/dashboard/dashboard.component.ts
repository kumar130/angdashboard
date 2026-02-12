import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TagConfigService } from '../tag-config.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  rules: any[] = [];
  total = 0;

  constructor(
    private http: HttpClient,
    private configService: TagConfigService
  ) {}

  ngOnInit(): void {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(csv => this.parse(csv));
  }

  parse(data: string) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');

    const arnHeader = headers.find(h => h.toLowerCase().includes('arn'));
    const resourceTypeHeader = headers.find(h =>
      h.toLowerCase().includes('resourcetype')
    );

    const parsed = rows.slice(1)
      .filter(r => r)
      .map(r => {
        const cols = r.split(',');
        const obj: any = {};

        headers.forEach((h, i) => {
          obj[h.trim()] = cols[i]?.trim();
        });

        // Resource Name from ARN
        if (arnHeader && obj[arnHeader]) {
          const arn = obj[arnHeader];
          obj.resourceName = arn.substring(arn.lastIndexOf('/') + 1);
        } else {
          obj.resourceName = 'UNKNOWN';
        }

        // Resource Type
        if (resourceTypeHeader && obj[resourceTypeHeader]) {
          obj.resourceType = obj[resourceTypeHeader];
        } else {
          obj.resourceType = 'UNKNOWN';
        }

        return obj;
      });

    this.configService.setCSV(parsed);
    this.total = parsed.length;
    this.rules = this.configService.evaluate();
  }
}
