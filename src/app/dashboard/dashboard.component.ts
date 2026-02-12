import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalResources = 0;

  envCompliance = 0;
  customerCompliance = 0;

  showEnvDetails = false;
  showCustomerDetails = false;

  nonCompliantEnv: any[] = [];
  nonCompliantCustomer: any[] = [];

  validCustomers = ['multi-tenant', 'BI', 'CTOS'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(csv => this.processCSV(csv));
  }

  processCSV(data: string) {

    const rows = data.split('\n');
    const headers = rows[0].split(',');

    const resourceIndex = headers.findIndex(h => h.toLowerCase().includes('resource'));
    const envIndex = headers.findIndex(h => h.trim() === 'environment');
    const customerIndex = headers.findIndex(h => h.trim() === 'customer');

    let envValidCount = 0;
    let customerValidCount = 0;

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i]) continue;

      const cols = rows[i].split(',');
      this.totalResources++;

      const resourceId = cols[resourceIndex];
      const env = cols[envIndex];
      const customer = cols[customerIndex];

      // ENVIRONMENT RULE
      if (env === 'sbx') {
        envValidCount++;
      } else {
        this.nonCompliantEnv.push({
          resourceId,
          value: env || 'MISSING'
        });
      }

      // CUSTOMER RULE
      if (this.validCustomers.includes(customer)) {
        customerValidCount++;
      } else {
        this.nonCompliantCustomer.push({
          resourceId,
          value: customer || 'MISSING'
        });
      }
    }

    this.envCompliance =
      Math.round((envValidCount / this.totalResources) * 100);

    this.customerCompliance =
      Math.round((customerValidCount / this.totalResources) * 100);
  }

  toggleEnvDetails() {
    this.showEnvDetails = !this.showEnvDetails;
  }

  toggleCustomerDetails() {
    this.showCustomerDetails = !this.showCustomerDetails;
  }
}
