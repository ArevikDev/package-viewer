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
}
