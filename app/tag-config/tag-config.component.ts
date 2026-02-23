
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tag-config',
  templateUrl: './tag-config.component.html'
})
export class TagConfigComponent {
  tags = [{ key: '', value: '' }];

  constructor(private tagService: TagService, private router: Router) {}

  addTag() { this.tags.push({ key: '', value: '' }); }

  generate() {
    this.tagService.setTags(this.tags);
    this.router.navigate(['/report']);
  }
}
