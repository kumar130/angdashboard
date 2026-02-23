import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagConfigService } from '../tag-config.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {

  tagKey: string = '';
  tagValue: string = '';

  rules: { key: string; value: string }[] = [];

  constructor(
    private router: Router,
    private service: TagConfigService
  ) {}

  addRule() {
    if (!this.tagKey || !this.tagValue) return;

    this.rules.push({
      key: this.tagKey,
      value: this.tagValue
    });

    this.
