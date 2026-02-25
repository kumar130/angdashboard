import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit {

  total = 120;
  compliant = 90;
  nonCompliant = 30;

  compliancePercent = Math.round((this.compliant / this.total) * 100);

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    new Chart("complianceChart", {
      type: 'doughnut',
      data: {
        labels: ['Compliant', 'Non-Compliant'],
        datasets: [{
          data: [this.compliant, this.nonCompliant]
        }]
      }
    });
  }
}
