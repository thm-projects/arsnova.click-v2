import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ThemesService} from '../../../service/themes.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';

@Component({
  selector: 'app-quiz-theme',
  templateUrl: './quiz-theme.component.html',
  styleUrls: ['./quiz-theme.component.scss']
})
export class QuizThemeComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizThemeComponent';

  private previewThemeBackup: string;

  constructor(
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
    private themesService: ThemesService
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizThemeComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.currentQuizService.persistToSessionStorage();
    this.themesService.updateCurrentlyUsedTheme();
  }

  updateTheme(id: string) {
    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
    this.previewThemeBackup = document.getElementsByTagName('html').item(0).dataset['theme'];
    this.currentQuizService.quiz.sessionConfig.theme = id;
    this.currentQuizService.toggleSettingByName('theme', id);
  }

  previewTheme(id) {
    document.getElementsByTagName('html').item(0).dataset['theme'] = id;
  }

  restoreTheme() {
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    document.getElementsByTagName('html').item(0).dataset['theme'] = this.previewThemeBackup;

    if (themeDataset === this.previewThemeBackup) {
      return;
    }


    this.themesService.reloadLinkNodes(this.previewThemeBackup);
  }

}
