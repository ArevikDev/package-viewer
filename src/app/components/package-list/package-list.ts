import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PackageApiService } from '../../services/package-api.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Package } from '../../models/package.model';
import { PackageCard } from '../package-card/package-card';

@Component({
  selector: 'app-package-list',
  imports: [AsyncPipe, PackageCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './package-list.html',
  styleUrl: './package-list.scss',
})
export class PackageList {
  private api = inject(PackageApiService);
  private packages$: Observable<Package[]> = this.api.getPackages();
  private filterText$ = new BehaviorSubject<string>('');

  filteredPackages$: Observable<Package[]> = combineLatest([this.packages$, this.filterText$]).pipe(
    map(([packages, filterText]: [Package[], string]) =>
      packages.filter((p: Package) => p.id.toLowerCase().includes(filterText.toLowerCase())),
    ),
  );

  onFilterChange(value: string): void {
    this.filterText$.next(value);
  }
}
