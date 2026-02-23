import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TagService {
  private tags: any[] = [];
  setTags(tags: any[]) { this.tags = tags; }
  getTags() { return this.tags; }
}
