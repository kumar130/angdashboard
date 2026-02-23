import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConfigService, ResourceRow } from '../tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  resources: ResourceRow[] = [];

  compliant = 0;
  nonCompliant = 0;

  constructor(private service: TagConfigService) {}

  ngOnInit(): void {

    this.service.loadCsv().subscribe(resources => {

      const result = this.service.calculateCompliance(resources);

      this.resources = result;

      this.compliant = result.filter(r => r.compliance === 'COMPLIANT').length;
      this.nonCompliant = result.filter(r => r.compliance === 'NON_COMPLIANT').length;
    });
  }
}
