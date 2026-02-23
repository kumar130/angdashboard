
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  resources: any[] = [];
  failed: any = {};
  requiredTags: any[] = [];

  constructor(private http: HttpClient, private tagService: TagService) {}

  ngOnInit() {
    this.requiredTags = this.tagService.getTags();
    this.http.get('assets/sample.csv', { responseType: 'text' })
      .subscribe(data => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result: any) => {
            this.resources = result.data;
            this.check();
          }
        });
      });
  }

  check() {
    this.resources.forEach(r => {
      let type = r.ResourceType || 'Unknown';
      let failedTags: any[] = [];

      this.requiredTags.forEach(t => {
        if (r[t.key] !== t.value) {
          failedTags.push({
            key: t.key,
            expected: t.value,
            actual: r[t.key] || 'Missing'
          });
        }
      });

      if (failedTags.length > 0) {
        if (!this.failed[type]) this.failed[type] = [];
        this.failed[type].push({
          id: r.ResourceId,
          failures: failedTags
        });
      }
    });
  }
}
