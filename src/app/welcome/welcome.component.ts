import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <h1>Cloud Tag Compliance Platform</h1>

    <p>
      Define tag policies and instantly analyze compliance
      across your cloud resources.
    </p>

    <button (click)="start()">Get Started</button>
  `
})
export class WelcomeComponent {

  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/config']);
  }
}
