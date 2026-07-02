import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
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
  readonly package = input.required<Package>();
  readonly highlight = input<'self' | 'dependency' | null>(null);

  readonly packageHovered = output<boolean>();

  readonly idParts = computed(() => {
    const [scope, name] = this.package().id.split('/');
    return name ? { scope, name } : { scope: null, name: scope };
  });

  readonly highlightClass = computed(() => {
    const state = this.highlight();
    return state === 'self' ? 'bg-blue-100' : state === 'dependency' ? 'bg-violet-100' : '';
  });

  readonly dependencyLabel = computed(() => {
    return this.package().dependencyCount === 1 ? 'dependency' : 'dependencies';
  });
}
