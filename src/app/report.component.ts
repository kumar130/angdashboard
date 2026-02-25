import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, FormsModule } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit {

  // Tag Inputs
  tags: any[] = [
    { key: 'environment', value: 'sbx' }
  ];

  // Dashboard Data
  total = 0;
  compliant = 0;
  nonCompliant = 0;
  compliancePercent = 0;

  chart: any;

  ngAfterViewInit() {}

  addTag() {
    this.tags.push({ key: '', value: '' });
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  generateReport() {

    // 🔥 Replace this with real API later
    this.total = 120;
    this.compliant = Math.floor(Math.random() * 100);
    this.nonCompliant = this.total - this.compliant;

    this.compliancePercent = Math.round(
      (this.compliant / this.total) * 100
    );

    this.loadChart();
  }

  loadChart() {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("complianceChart", {
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
