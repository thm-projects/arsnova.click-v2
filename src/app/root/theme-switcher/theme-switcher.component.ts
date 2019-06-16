import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AutoUnsubscribe } from '../../../lib/AutoUnsubscribe';
import { DbTable, StorageKey } from '../../../lib/enums/enums';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions') //
export class ThemeSwitcherComponent implements OnDestroy {
  public static TYPE = 'ThemeSwitcherComponent';

  private previewThemeBackup: string;
  private _subscriptions: Array<Subscription> = [];
  private _themeChangedEmitter = new EventEmitter<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private storageService: StorageService,
    private quizService: QuizService,
    private router: Router,
  ) {

    this.footerBarService.TYPE_REFERENCE = ThemeSwitcherComponent.TYPE;

    headerLabelService.headerLabel = 'component.theme_switcher.set_theme';

    if (isPlatformBrowser(this.platformId)) {
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    }

    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(() => {
      this._subscriptions.push(this._themeChangedEmitter.subscribe((themeId) => {
        this.quizService.quiz.sessionConfig.theme = themeId;
        this.quizService.persist();
      }));
    }));

    let footerElements;
    if (environment.forceQuizTheme && sessionStorage.getItem(StorageKey.CurrentQuizName)) {
      this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
      footerElements = [this.footerBarService.footerElemBack];

      this.footerBarService.footerElemBack.onClickCallback = () => {
        this.router.navigate(['/quiz', 'manager']);
      };
    } else {
      footerElements = [
        this.footerBarService.footerElemHome, this.footerBarService.footerElemAbout, this.footerBarService.footerElemTranslation,
      ];
    }
    footerBarService.replaceFooterElements(footerElements);
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

  public updateTheme(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
      this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, this.previewThemeBackup).subscribe();
      this._themeChangedEmitter.emit(id);
    }
  }

  public previewTheme(id): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    }
  }

  public restoreTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

      if (themeDataset !== this.previewThemeBackup) {
        document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;
        this.themesService.reloadLinkNodes(this.previewThemeBackup);
        return;
      }
    }
  }

}
