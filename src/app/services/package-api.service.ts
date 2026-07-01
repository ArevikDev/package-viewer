import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Package } from '../models/package.model';

@Injectable({ providedIn: 'root' })
export class PackageApiService {
  private http = inject(HttpClient);
  private base = '/api';

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.base}/packages`);
  }

  getDependencies(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/packages/${encodeURIComponent(id)}/dependencies`);
  }
}
