import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from "../../service/footer-bar.service";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";

@Component({
  selector: 'app-quiz-theme',
  templateUrl: './quiz-theme.component.html',
  styleUrls: ['./quiz-theme.component.scss']
})
export class QuizThemeComponent implements OnInit, OnDestroy {

  private previewThemeBackup: string;

  constructor(private footerBarService: FooterBarService,
              private activeQuestionGroupService: ActiveQuestionGroupService) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
    ]);
    this.previewThemeBackup = document.getElementsByTagName('body')[0].className;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
  }

  updateTheme(id: string) {
    document.getElementsByTagName('body')[0].className = id;
    this.previewThemeBackup = document.getElementsByTagName('body')[0].className;
    window.sessionStorage.setItem('quizTheme', this.previewThemeBackup);
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.theme = id;
  }

  previewTheme(id) {
    document.getElementsByTagName('body')[0].className = id;
  }

  restoreTheme() {
    document.getElementsByTagName('body')[0].className = this.previewThemeBackup;
  }

}
