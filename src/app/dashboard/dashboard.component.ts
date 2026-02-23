import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  rules: any[] = [];

  constructor(private configService: TagConfigService) {
    this.rules = this.configService.getRules();
  }

}
