import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TagConfigService, TagRule } from '../tag-config.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html'
})
export class ConfigComponent {

  rules: TagRule[] = [];

  tagKey = '';
  tagValue = '';

  constructor(
    private service: TagConfigService,
    private router: Router
  ) {}

  addRule() {
    if (!this.tagKey || !this.tagValue) return;

    this.rules.push({
      key: this.tagKey,
      value: this.tagValue
    });

    this.tagKey = '';
    this.tagValue = '';
  }

  saveAndGo() {
    this.service.setRules(this.rules);
    this.router.navigate(['/dashboard']);
  }
}
