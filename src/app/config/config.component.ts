import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagConfigService, TagRule } from '../tag-config.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html'
})
export class ConfigComponent {

  tagKey = '';
  tagValues = '';
  rules: TagRule[] = [];

  constructor(
    private router: Router,
    private configService: TagConfigService
  ) {}

  addRule() {
    this.rules.push({
      key: this.tagKey.trim(),
      allowedValues: this.tagValues.split(',').map(v => v.trim())
    });
    this.tagKey = '';
    this.tagValues = '';
  }

  saveAndGo() {
    this.configService.setRules(this.rules);
    this.router.navigate(['/dashboard']);
  }
}
