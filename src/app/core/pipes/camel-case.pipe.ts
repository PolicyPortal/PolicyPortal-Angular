import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camelCase', standalone: true })
export class CamelCasePipe implements PipeTransform {
  transform(value: unknown): string {
    if (value == null) return '';
    const s = String(value);
    // Preserve separators (space, hyphen, slash), Title-Case each word
    return s
      .toLowerCase()
      .split(/([-\s/]+)/)
      .map(part => /^[-\s/]+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}