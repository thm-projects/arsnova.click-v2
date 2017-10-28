import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {ThemesService} from '../../../service/themes.service';

@Component({
  selector: 'app-quiz-theme',
  templateUrl: './quiz-theme.component.html',
  styleUrls: ['./quiz-theme.component.scss']
})
export class QuizThemeComponent implements OnInit, OnDestroy {

  private previewThemeBackup: string;

  constructor(
    private footerBarService: FooterBarService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private themesService: ThemesService) {
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
    this.previewThemeBackup = document.body.className;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
    this.themesService.updateCurrentlyUsedTheme();
  }

  updateTheme(id: string) {
    document.body.className = id;
    this.previewThemeBackup = document.body.className;
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme = id;
  }

  previewTheme(id) {
    document.body.className = id;
  }

  restoreTheme() {
    document.body.className = this.previewThemeBackup;
  }

}
