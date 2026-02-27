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

  resourceTypes: string[] = [];
  selectedResource = '';

  allResources: any[] = [];
  filteredResources: any[] = [];

  total = 0;
  compliant = 0;
  nonCompliant = 0;
  compliancePercent = 0;

  chart: any;

  ngOnInit() {
    this.loadCSV();
  }

  // ✅ Load CSV from assets
  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => {
        this.parseCSV(data);
      });
  }

  // ✅ Parse CSV
  parseCSV(data: string) {

    const lines = data.split('\n').slice(1);
    this.allResources = [];

    for (let line of lines) {

      if (!line.trim()) continue;

      const cols = line.split(',');

      if (cols.length < 3) continue;

      this.allResources.push({
        type: cols[0].trim(),
        name: cols[1].trim(),
        status: cols[2].trim()
      });
    }

    // Detect resource types dynamically
    this.resourceTypes = [...new Set(this.allResources.map(r => r.type))];

    if (this.resourceTypes.length > 0) {
      this.selectedResource = this.resourceTypes[0];
      this.filterResources();
    }
  }

  // ✅ Filter by selected resource
  filterResources() {

    this.filteredResources = this.allResources
      .filter(r => r.type === this.selectedResource);

    this.calculateCompliance();
  }

  // ✅ Calculate compliance stats
  calculateCompliance() {

    this.total = this.filteredResources.length;

    this.compliant = this.filteredResources
      .filter(r => r.status === 'Compliant').length;

    this.nonCompliant = this.total - this.compliant;

    this.compliancePercent = this.total > 0
      ? Math.round((this.compliant / this.total) * 100)
      : 0;

    setTimeout(() => this.renderChart(), 0);
  }

  // ✅ Render pie chart
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
