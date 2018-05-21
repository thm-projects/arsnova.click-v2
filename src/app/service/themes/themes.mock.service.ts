import { Observable, of } from 'rxjs/index';

export class ThemesMockService {
  public updateCurrentlyUsedTheme(): Observable<void> {
    return of(null);
  }
}
