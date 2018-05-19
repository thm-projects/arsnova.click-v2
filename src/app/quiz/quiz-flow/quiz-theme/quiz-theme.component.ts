import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ThemesService} from '../../../service/themes.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-quiz-theme',
  templateUrl: './quiz-theme.component.html',
  styleUrls: ['./quiz-theme.component.scss']
})
export class QuizThemeComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizThemeComponent';

  private previewThemeBackup: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
    private themesService: ThemesService
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizThemeComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    if (isPlatformBrowser(this.platformId)) {
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.currentQuizService.persistToSessionStorage();
    this.themesService.updateCurrentlyUsedTheme();
  }

  updateTheme(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
      this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    }
    this.currentQuizService.quiz.sessionConfig.theme = id;
    this.currentQuizService.toggleSettingByName('theme', id);
  }

  previewTheme(id) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    }
  }

  restoreTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

      document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;

      if (themeDataset === this.previewThemeBackup) {
        return;
      }
    }

    this.themesService.reloadLinkNodes(this.previewThemeBackup);
  }

}
