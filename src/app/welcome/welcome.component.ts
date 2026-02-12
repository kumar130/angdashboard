import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {

  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/config']);
  }
}
