import { Component } from '@angular/core';
import { TagConfigService } from '../tag-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  config: any;

  constructor(private service: TagConfigService) {
    this.config = this.service.getConfig();
  }

}
