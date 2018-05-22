import { Observable, of } from 'rxjs/index';

export class ThemesMockService {
  public updateCurrentlyUsedTheme(): Observable<void> {
    return of(null);
  }

  public reloadLinkNodes(): Observable<void> {
    return of();
  }
}
