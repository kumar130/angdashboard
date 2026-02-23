import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  rules: { key: string; value: string }[] = [];

  constructor(private service: TagConfigService) {
    this.rules = this.service.getRules();
  }

}
