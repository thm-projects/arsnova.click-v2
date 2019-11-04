import { isPlatformServer } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, switchMapTo, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DbTable, StorageKey, TrackingCategoryType } from '../../../lib/enums/enums';
import { ThemesApiService } from '../../service/api/themes/themes-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent implements OnInit, OnDestroy {
  public static TYPE = 'ThemeSwitcherComponent';

  private _themeChangedEmitter = new EventEmitter<string>();

  private readonly _destroy = new Subject();

  constructor(
    public themesService: ThemesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private themesApiService: ThemesApiService,
    private storageService: StorageService,
    private quizService: QuizService,
    private router: Router,
  ) {

    this.footerBarService.TYPE_REFERENCE = ThemeSwitcherComponent.TYPE;

    headerLabelService.headerLabel = 'component.theme_switcher.set_theme';

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

  public ngOnInit(): void {
    const themeChanged$ = this._themeChangedEmitter.pipe(distinctUntilChanged(), takeUntil(this._destroy));

    this.quizService.quizUpdateEmitter.pipe(distinctUntilChanged(), takeUntil(this._destroy), filter(v => !!v), switchMapTo(themeChanged$))
    .subscribe(themeId => {
      this.quizService.quiz.sessionConfig.theme = themeId;
      this.quizService.persist();
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._destroy.next();
    this._destroy.complete();
  }

  public getThemePreviewUrl(id: string): Array<string> {
    return this.themesApiService.THEMES_PREVIEW_GET_URL(id, this.translateService.currentLang);
  }

  public getFallbackPreviewUrl(id: string): string {
    return this.themesApiService.getThemePreviewDefaultUrl(id, this.translateService.currentLang);
  }

  public change(id: string): void {
    if (isPlatformServer(this.platformId) || this.themesService.currentTheme === id) {
      return;
    }

    this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, id).subscribe(() => {
      this._themeChangedEmitter.emit(id);
      this.themesService.updateCurrentlyUsedTheme();
    });

    this.trackingService.trackEvent({
      action: ThemeSwitcherComponent.TYPE,
      category: TrackingCategoryType.ThemeChange,
      label: id,
    });
  }
}
