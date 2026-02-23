import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Compliance Dashboard</h2>

    <p>Compliant: {{ compliant }}</p>
    <p>Non-Compliant: {{ nonCompliant }}</p>
  `
})
export class DashboardComponent implements OnInit {

  compliant = 0;
  nonCompliant = 0;

  constructor(private service: TagConfigService) {}

  ngOnInit() {

    this.service.loadCsv().subscribe(resources => {

      const result = this.service.calculateCompliance(resources);

      this.compliant = result.filter(r => r.compliance === 'COMPLIANT').length;
      this.nonCompliant = result.filter(r => r.compliance === 'NON_COMPLIANT').length;
    });
  }
}
