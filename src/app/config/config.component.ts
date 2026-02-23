import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TagConfigService } from '../services/tag-config.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html'
})
export class ConfigComponent {

  tagKey = '';
  tagValue = '';

  rules: any[] = [];

  constructor(
    private router: Router,
    private configService: TagConfigService
  ) {}

  addRule() {

    if (!this.tagKey || !this.tagValue) return;

    this.rules.push({
      key: this.tagKey,
      values: this.tagValue.split(',').map(v => v.trim())
    });

    this.tagKey = '';
    this.tagValue = '';
  }

  saveAndGo() {

    this.configService.setRules(this.rules);

    this.router.navigate(['/dashboard']);
  }
}
