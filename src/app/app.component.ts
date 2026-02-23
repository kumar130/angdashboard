import { Component } from '@angular/core';

interface TagRule {
  key: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  step = 1;

  tagKey = '';
  tagValue = '';

  rules: TagRule[] = [];

  // Step navigation
  getStarted() {
    this.step = 2;
  }

  configureTagPolicy() {
    this.step = 3;
  }

  addRule() {
    if (!this.tagKey || !this.tagValue) return;

    this.rules.push({
      key: this.tagKey,
      value: this.tagValue
    });

    // reset fields
    this.tagKey = '';
    this.tagValue = '';
  }
}
