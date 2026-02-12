import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalResources = 0;

  customerCompliance = 0;
  environmentCompliance = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => {
        this.processCSV(data);
      });
  }

  processCSV(data: string) {

    const rows = data.split('\n');
    const headers = rows[0].split(',');

    const customerIndex = headers.findIndex(h =>
      h.trim().toLowerCase() === 'customer'
    );

    const environmentIndex = headers.findIndex(h =>
      h.trim().toLowerCase() === 'environment'
    );

    let customerCount = 0;
    let environmentCount = 0;

    for (let i = 1; i < rows.length; i++) {

      if (!rows[i]) continue;

      const cols = rows[i].split(',');

      this.totalResources++;

      if (cols[customerIndex] && cols[customerIndex].trim() !== '') {
        customerCount++;
      }

      if (cols[environmentIndex] && cols[environmentIndex].trim() !== '') {
        environmentCount++;
      }
    }

    this.customerCompliance =
      Math.round((customerCount / this.totalResources) * 100);

    this.environmentCompliance =
      Math.round((environmentCount / this.totalResources) * 100);
  }
}
