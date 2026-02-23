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
  key = '';
  value = '';

  constructor(
    private service: TagConfigService,
    private router: Router
  ) {}

  addRule() {
    if (!this.key || !this.value) return;

    this.rules.push({
      key: this.key,
      value: this.value
    });

    this.key = '';
    this.value = '';
  }

  save() {
    this.service.setRules(this.rules);
    this.router.navigate(['/dashboard']);
  }
}
