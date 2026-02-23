import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TagConfigService } from '../tag-config.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './config.component.html'
})
export class ConfigComponent {

  tagKey = '';
  tagValue = '';

  constructor(
    private router: Router,
    private service: TagConfigService
  ) {}

  save() {
    this.service.setConfig(this.tagKey, this.tagValue);
    this.router.navigate(['/dashboard']);
  }
}
