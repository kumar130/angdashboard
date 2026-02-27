import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private http: HttpClient) {}

  // User input
  tagKey = '';
  tagValue = '';

  allResources: any[] = [];
  evaluatedResources: any[] = [];

  total = 0;
  compliant = 0;
  nonCompliant = 0;
  compliancePercent = 0;

  chart: any;

  ngOnInit() {
    this.loadCSV();
  }

  // Load CSV from assets
  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => {
        this.parseCSV(data);
      });
  }

  // Parse CSV and group tags per resource
  parseCSV(data: string) {

    const lines = data.split('\n').slice(1);
    const resourceMap: any = {};

    for (let line of lines) {

      if (!line.trim()) continue;

      const cols = line.split(',');

      if (cols.length < 4) continue;

      const type = cols[0].trim();
      const name = cols[1].trim();
      const key = cols[2].trim();
      const value = cols[3].trim();

      const resourceId = type + '-' + name;

      if (!resourceMap[resourceId]) {
        resourceMap[resourceId] = {
          type,
          name,
          tags: {}
        };
      }

      resourceMap[resourceId].tags[key] = value;
    }

    this.allResources = Object.values(resourceMap);
  }

  // Evaluate compliance based on user input
  generateReport() {

    if (!this.tagKey || !this.tagValue) return;

    this.evaluatedResources = [];

    for (let resource of this.allResources) {

      const isCompliant =
        resource.tags[this.tagKey] === this.tagValue;

      this.evaluatedResources.push({
        ...resource,
        status: isCompliant ? 'Compliant' : 'Non-Compliant'
      });
    }

    this.calculateCompliance();
  }

  calculateCompliance() {

    this.total = this.evaluatedResources.length;

    this.compliant = this.evaluatedResources
      .filter(r => r.status === 'Compliant').length;

    this.nonCompliant = this.total - this.compliant;

    this.compliancePercent = this.total > 0
      ? Math.round((this.compliant / this.total) * 100)
      : 0;

    setTimeout(() => this.renderChart(), 0);
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
