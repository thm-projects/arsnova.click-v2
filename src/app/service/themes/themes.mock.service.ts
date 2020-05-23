import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs/index';
import { QuizTheme } from '../../lib/enums/QuizTheme';

export class ThemesMockService {
  public readonly themeChanged: EventEmitter<QuizTheme> = new EventEmitter<QuizTheme>();

  public updateCurrentlyUsedTheme(): Observable<void> {
    return of(null);
  }

  public reloadLinkNodes(): Observable<void> {
    return of();
  }

  public initTheme(): void {}
}
