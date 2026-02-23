import { Component, OnInit } from '@angular/core';
import { TagConfigService } from '../services/tag-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  rules: any[] = [];

  constructor(private configService: TagConfigService) {}

  ngOnInit() {

    this.rules = this.configService.getRules();

    console.log('Rules:', this.rules);
  }
}
