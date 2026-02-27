import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit {

  tags = [
    { key: 'environment', value: 'sbx' }
  ];

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
