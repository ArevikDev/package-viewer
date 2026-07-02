import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PackageApiService } from '../../services/package-api.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  delay,
  exhaustMap,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
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

  private refresh$ = new BehaviorSubject<void>(undefined);
  loading$ = new BehaviorSubject<boolean>(false);

  private filterText$ = new BehaviorSubject<string>('');
  private hoveredId$ = new BehaviorSubject<string | null>(null);

  private packages$: Observable<Package[]> = this.refresh$.pipe(
    tap(() => this.loading$.next(true)),
    exhaustMap(() => this.api.getPackages().pipe(tap(() => this.loading$.next(false)))),
  );

  filteredPackages$: Observable<Package[]> = combineLatest([
    this.packages$,
    this.filterText$.pipe(map((v) => v.toLowerCase())),
  ]).pipe(
    map(([packages, filterText]: [Package[], string]) =>
      packages.filter((p: Package) => p.id.toLowerCase().includes(filterText)),
    ),
  );

  highlights$: Observable<Map<string, 'self' | 'dependency'>> = this.hoveredId$.pipe(
    debounceTime(100),
    switchMap((hoveredId) =>
      hoveredId
        ? this.api.getDependencies(hoveredId).pipe(
            map((deps) => {
              const highlights = new Map<string, 'self' | 'dependency'>();
              highlights.set(hoveredId, 'self');
              deps.forEach((id) => highlights.set(id, 'dependency'));
              return highlights;
            }),
          )
        : of(new Map<string, 'self' | 'dependency'>()),
    ),
  );

  onFilterChange(value: string): void {
    this.filterText$.next(value);
  }

  onCardHover(id: string | null): void {
    this.hoveredId$.next(id);
  }

  onRefresh(): void {
    this.refresh$.next();
  }
}
