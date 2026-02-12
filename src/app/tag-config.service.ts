import { Injectable } from '@angular/core';

export interface TagRule {
  key: string;
  allowedValues: string[];
  compliance?: number;
  nonCompliant?: any[];
}

@Injectable({ providedIn: 'root' })
export class TagConfigService {

  rules: TagRule[] = [];
  csvRows: any[] = [];

  setRules(rules: TagRule[]) {
    this.rules = rules;
  }

  setCSV(rows: any[]) {
    this.csvRows = rows;
  }

  evaluate() {
    const total = this.csvRows.length;

    this.rules.forEach(rule => {
      let valid = 0;
      rule.nonCompliant = [];

      this.csvRows.forEach(row => {
        const value = row[rule.key];

        if (value && rule.allowedValues.includes(value)) {
          valid++;
        } else {
          rule.nonCompliant!.push({
            resource: row.resourceName || 'UNKNOWN',
            resourceType: row.resourceType || 'UNKNOWN',
            value: value || 'MISSING'
          });
        }
      });

      rule.compliance = Math.round((valid / total) * 100);
    });

    return this.rules;
  }
}
