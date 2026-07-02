import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'compactNumber' })
export class CompactNumberPipe implements PipeTransform {
  transform(value: number): string {
    return value > 1000 ? `${Math.floor(value / 1000).toLocaleString()}K` : `${value}`;
  }
}
