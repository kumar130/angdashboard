import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  tags = [
    { key: 'environment', value: 'sbx' }
  ];

  total = 0;
  compliant = 0;
  nonCompliant = 0;
  compliancePercent = 0;

  resources: any[] = [];
  chart: any;

  addTag() {
    this.tags.push({ key: '', value: '' });
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  generateReport() {

    this.total = 20;
    this.resources = [];
    this.compliant = 0;

    for (let i = 1; i <= this.total; i++) {

      const isCompliant = Math.random() > 0.3;

      if (isCompliant) this.compliant++;

      this.resources.push({
        name: `EC2-Instance-${i}`,
        status: isCompliant ? 'Compliant' : 'Non-Compliant'
      });
    }

    this.nonCompliant = this.total - this.compliant;

    this.compliancePercent = Math.round(
      (this.compliant / this.total) * 100
    );

    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  renderChart() {

    const canvas = document.getElementById('complianceChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Compliant', 'Non-Compliant'],
        datasets: [{
          data: [this.compliant, this.nonCompliant]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
