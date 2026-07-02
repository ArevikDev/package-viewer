import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Package } from '../models/package.model';

@Injectable({ providedIn: 'root' })
export class PackageApiService {
  private http = inject(HttpClient);
  private base = '/api';
  private dependenciesCache = new Map<string, Observable<string[]>>();

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.base}/packages`);
  }

  getDependencies(id: string): Observable<string[]> {
    let cached = this.dependenciesCache.get(id);
    if (!cached) {
      cached = this.http
        .get<string[]>(`${this.base}/packages/${encodeURIComponent(id)}/dependencies`)
        .pipe(shareReplay(1));
      this.dependenciesCache.set(id, cached);
    }
    return cached;
  }
}
