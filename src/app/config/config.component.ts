import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html'
})
export class ConfigComponent {

  tagKey = '';
  tagValue = '';

  constructor(
    private service: TagConfigService,
    private router: Router
  ) {}

  saveAndGo() {

    this.service.setRequiredTags({
      [this.tagKey]: this.tagValue
    });

    this.router.navigate(['/dashboard']);
  }
}
