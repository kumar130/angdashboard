import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <h1>AWS Tag Compliance Dashboard</h1>
    <button (click)="start()">Get Started</button>
  `
})
export class WelcomeComponent {

  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/config']);
  }
}
