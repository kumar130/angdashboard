import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @ViewChild('pieCanvas') pieCanvas!: ElementRef;

  resources: any[] = [];
  filteredResources: any[] = [];

  tags: { key: string; value: string }[] = [
    { key: '', value: '' }
  ];

  total = 0;
  compliant = 0;
  failed = 0;
  compliancePercent = 0;

  chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('assets/tag-report.csv', { responseType: 'text' })
      .subscribe(data => {
        this.parseCSV(data);
      });
  }

  parseCSV(data: string) {
    const lines = data.split('\n').filter(l => l.trim() !== '');
    const headers = lines[0]
      .split(',')
      .map(h => h.trim().replace(/\r/g, ''));

    this.resources = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};

      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim().replace(/\r/g, '') || '';
      });

      return obj;
    });

    this.filteredResources = [];
  }

  addTag() {
    this.tags.push({ key: '', value: '' });
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  generateReport() {

    this.filteredResources = this.resources.map(resource => {

      let isCompliant = true;

      for (let tag of this.tags) {
        if (!tag.key) continue;

        const value = resource[tag.key];

        if (!value || value !== tag.value) {
          isCompliant = false;
          break;
        }
      }

      // ✅ Correct column name: ResourceArn
      const arn = resource['ResourceArn'] || '';
      let extractedName = '';

      if (arn) {
        const lastSlash = arn.lastIndexOf('/');
        const lastColon = arn.lastIndexOf(':');
        const index = Math.max(lastSlash, lastColon);

        if (index !== -1) {
          extractedName = arn.substring(index + 1);
        }
      }

      // Fallback
      if (!extractedName) {
        extractedName = 'Unknown';
      }

      return {
        ...resource,
        extractedName,
        status: isCompliant ? 'COMPLIANT' : 'FAILED'
      };
    });

    this.total = this.filteredResources.length;
    this.compliant = this.filteredResources.filter(r => r.status === 'COMPLIANT').length;
    this.failed = this.total - this.compliant;
    this.compliancePercent = this.total
      ? Math.round((this.compliant / this.total) * 100)
      : 0;

    setTimeout(() => this.renderChart(), 0);
  }

  renderChart() {

    if (!this.pieCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.pieCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Compliant', 'Failed'],
        datasets: [{
          data: [this.compliant, this.failed]
        }]
      }
    });
  }
}
