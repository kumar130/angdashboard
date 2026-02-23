
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [RouterLink],
  template: `
    <h1>AWS Tagging Compliance Dashboard</h1>
    <p>This tool checks resource tag compliance.</p>
    <button routerLink="/configure">Get Started</button>
  `
})
export class WelcomeComponent {}
