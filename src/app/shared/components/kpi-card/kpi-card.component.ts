import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div [style.color]="value >= 95 ? 'green' : value >= 80 ? 'orange' : 'red'">
      <h3>{{tag}}</h3>
      <strong>{{value}}%</strong>
    </div>
  `
})
export class KpiCardComponent {
  @Input() tag!: string;
  @Input() value!: number;
}