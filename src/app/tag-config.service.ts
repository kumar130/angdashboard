import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagConfigService {

  private config: any = {};

  setConfig(key: string, value: string) {
    this.config = { key, value };
  }

  getConfig() {
    return this.config;
  }

}
