import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  private rules: { key: string; value: string }[] = [];

  setRules(rules: { key: string; value: string }[]) {
    this.rules = rules;
  }

  getRules() {
    return this.rules;
  }

}
