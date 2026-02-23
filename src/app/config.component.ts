import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   // 🔥 ADD THIS

@Component({
  standalone: true,
  selector: 'app-config',
  imports: [CommonModule, FormsModule],  // 🔥 ADD CommonModule
  template: `
    <h2>Configure Tags</h2>

    <div *ngFor="let tag of tags">
      <input [(ngModel)]="tag.key" placeholder="Key">
      =
      <input [(ngModel)]="tag.value" placeholder="Value">
    </div>

    <br>
    <button (click)="add()">Add Tag</button>
    <button (click)="go()">Generate Report</button>
  `
})
export class ConfigComponent {

  tags = [{ key: 'env', value: 'sbx' }];

  constructor(private router: Router) {}

  add() {
    this.tags.push({ key: '', value: '' });
  }

  go() {
    localStorage.setItem('requiredTags', JSON.stringify(this.tags));
    this.router.navigate(['/report']);
  }
}