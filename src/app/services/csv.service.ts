import { Injectable } from '@angular/core';

export interface ResourceRow {
  resourceId: string;
  resourceType: string;
  compliant: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  parse(csvText: string, requiredTags: string[]): ResourceRow[] {

    const lines = csvText.split('\n').filter(l => l.trim().length > 0);

    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());

    const arnIndex = headers.findIndex(h => h === 'ResourceArn');
    const typeIndex = headers.findIndex(h => h === 'ResourceType');

    const tagIndexes = requiredTags.map(tag =>
      headers.findIndex(h => h.toLowerCase() === tag.toLowerCase())
    );

    const rows: ResourceRow[] = [];

    for (let i = 1; i < lines.length; i++) {

      const cols = this.safeSplit(lines[i], headers.length);

      const arn = cols[arnIndex] || '';
      const resourceId = this.extractIdFromArn(arn);
      const resourceType = cols[typeIndex] || '';

      let compliant = true;

      for (const idx of tagIndexes) {
        if (idx === -1 || !cols[idx] || cols[idx].trim() === '') {
          compliant = false;
          break;
        }
      }

      rows.push({
        resourceId,
        resourceType,
        compliant
      });
    }

    return rows;
  }

  private extractIdFromArn(arn: string): string {
    if (!arn) return 'Unknown';

    const parts = arn.split('/');
    return parts[parts.length - 1] || 'Unknown';
  }

  private safeSplit(line: string, expected: number): string[] {
    const cols = line.split(',');

    while (cols.length < expected) {
      cols.push('');
    }

    return cols;
  }
}
