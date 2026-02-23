import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  results: any[] = [];

  compliant = 0;
  nonCompliant = 0;

  resourceSummary: any[] = [];

  constructor(private service: TagConfigService) {}

  ngOnInit(): void {

    this.service.loadCsv().subscribe(resources => {

      const result = this.service.calculateCompliance(resources);

      this.results = result;

      this.compliant = result.filter(r => r.compliance === 'COMPLIANT').length;
      this.nonCompliant = result.filter(r => r.compliance === 'NON_COMPLIANT').length;

      this.buildSummary(result);
    });
  }

  buildSummary(data: any[]) {

    const map: any = {};

    for (const r of data) {

      if (!map[r.resourceType]) {
        map[r.resourceType] = {
          type: r.resourceType,
          compliant: 0,
          nonCompliant: 0
        };
      }

      if (r.compliance === 'COMPLIANT') {
        map[r.resourceType].compliant++;
      } else {
        map[r.resourceType].nonCompliant++;
      }
    }

    this.resourceSummary = Object.values(map);
  }
}
