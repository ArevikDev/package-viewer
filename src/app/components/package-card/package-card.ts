import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Package } from '../../models/package.model';
import { CompactNumberPipe } from '../../pipes/compact-number.pipe';

@Component({
  selector: 'app-package-card',
  imports: [CompactNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './package-card.html',
  styleUrl: './package-card.scss',
})
export class PackageCard {
  @Input() package!: Package;
  @Input() highlight: 'self' | 'dependency' | null = null;
  @Output() packageHovered = new EventEmitter<boolean>();

  get idParts(): { scope: string | null; name: string } {
    const i = this.package.id.indexOf('/');
    return i === -1
      ? { scope: null, name: this.package.id }
      : { scope: this.package.id.slice(0, i), name: this.package.id.slice(i + 1) };
  }

  get highlightClass(): string {
    return this.highlight === 'self'
      ? 'bg-blue-100'
      : this.highlight === 'dependency'
        ? 'bg-violet-100'
        : '';
  }

  get dependencyLabel(): string {
    return this.package.dependencyCount === 1 ? 'dependency' : 'dependencies';
  }
}
