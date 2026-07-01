import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PackageList } from './components/package-list/package-list';

@Component({
  selector: 'app-root',
  imports: [PackageList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
