import { Component, OnInit } from '@angular/core';
import { CsvService, ResourceRow } from '../services/csv.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  resources: ResourceRow[] = [];

  compliantCount = 0;
  nonCompliantCount = 0;

  requiredTags = ['Name', 'Environment']; // default policy

  constructor(private csvService: CsvService) {}

  ngOnInit(): void {
    this.loadCsv();
  }

  loadCsv() {

    fetch('/assets/tag-report.csv')
      .then(r => r.text())
      .then(text => {

        this.resources = this.csvService.parse(text, this.requiredTags);

        this.compliantCount =
          this.resources.filter(r => r.compliant).length;

        this.nonCompliantCount =
          this.resources.filter(r => !r.compliant).length;
      });
  }
}
