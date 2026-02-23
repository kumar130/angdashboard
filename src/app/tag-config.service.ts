import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  private rules: any[] = [];

  setRules(rules: any[]) {
    this.rules = rules;
  }

  getRules() {
    return this.rules;
  }

}
