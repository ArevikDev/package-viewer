import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './package-card.html',
  styleUrl: './package-card.scss',
})
export class PackageCard {
  @Input() package!: Package;

  get idParts(): { scope: string | null; name: string } {
    const i = this.package.id.indexOf('/');
    return i === -1
      ? { scope: null, name: this.package.id }
      : { scope: this.package.id.slice(0, i), name: this.package.id.slice(i + 1) };
  }
}
