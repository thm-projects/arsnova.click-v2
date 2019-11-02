import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, switchMapTo, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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
})
export class ThemeSwitcherComponent implements OnInit, OnDestroy {
  public static TYPE = 'ThemeSwitcherComponent';

  private previewThemeBackup: string;
  private _themeChangedEmitter = new EventEmitter<string>();

  private readonly _destroy = new Subject();

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

    this.quizService.quizUpdateEmitter.pipe(distinctUntilChanged(), takeUntil(this._destroy), switchMapTo(themeChanged$)).subscribe(themeId => {
      this.quizService.quiz.sessionConfig.theme = themeId;
      this.quizService.persist();
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._destroy.next();
    this._destroy.complete();
  }

  public updateTheme(id: string): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, this.previewThemeBackup).subscribe();
    this._themeChangedEmitter.emit(id);
  }

  public previewTheme(id): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    }
  }

  public restoreTheme(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    if (themeDataset !== this.previewThemeBackup) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;
      this.themesService.reloadLinkNodes(this.previewThemeBackup);
      return;
    }
  }
}
