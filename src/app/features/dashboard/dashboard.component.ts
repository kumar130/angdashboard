import { Component } from '@angular/core';
import { ComplianceService } from '../../core/services/compliance.service';
import { ComplianceResponse } from '../../core/models/compliance.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  data?: ComplianceResponse;

  constructor(private service: ComplianceService) {}

  load(accountId: string) {
    this.service.getCompliance(accountId)
      .subscribe(res => this.data = res);
  }
}