import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PackageApiService } from '../../services/package-api.service';
import { Observable } from 'rxjs';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-list',
  imports: [AsyncPipe],
  templateUrl: './package-list.html',
  styleUrl: './package-list.scss',
})
export class PackageList {
  private api = inject(PackageApiService);
  packages$: Observable<Package[]> = this.api.getPackages();
}
