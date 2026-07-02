import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import {
  auditTime,
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  exhaustMap,
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Package } from '../../models/package.model';
import { PackageApiService } from '../../services/package-api.service';
import { PackageCard } from '../package-card/package-card';

@Component({
  selector: 'app-package-list',
  imports: [AsyncPipe, PackageCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './package-list.html',
  styleUrl: './package-list.scss',
})
export class PackageList {
  private readonly api = inject(PackageApiService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly loading$ = new BehaviorSubject<boolean>(false);

  private readonly filterText$ = new BehaviorSubject<string>('');

  private readonly hoveredId$ = new BehaviorSubject<string | null>(null);

  private readonly packages$: Observable<Package[]> = this.refresh$.pipe(
    tap(() => {
      this.loading$.next(true);
      this.api.clearDependenciesCache();
    }),
    exhaustMap(() =>
      this.api.getPackages().pipe(
        catchError(() => of([])),
        finalize(() => this.loading$.next(false)),
      ),
    ),
  );

  readonly filteredPackages$: Observable<Package[]> = combineLatest([
    this.packages$,
    this.filterText$.pipe(map((v) => v.toLowerCase())),
  ]).pipe(
    map(([packages, filterText]: [Package[], string]) =>
      packages.filter((p: Package) => p.id.toLowerCase().includes(filterText)),
    ),
  );

  readonly highlights$: Observable<Map<string, 'self' | 'dependency'>> = this.hoveredId$.pipe(
    debounceTime(100),
    switchMap((hoveredId) => {
      if (!hoveredId) {
        return of(new Map<string, 'self' | 'dependency'>());
      }

      return this.api.getDependencies(hoveredId).pipe(
        map((deps) => {
          const highlights = new Map<string, 'self' | 'dependency'>();
          highlights.set(hoveredId, 'self');
          deps.forEach((id) => highlights.set(id, 'dependency'));
          return highlights;
        }),
      );
    }),
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
