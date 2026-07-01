import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Package } from '../models/package.model';

@Service()
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
