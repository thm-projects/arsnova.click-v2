import {Component, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {HeaderLabelService} from '../../service/header-label.service';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {questionGroupReflection} from '../../../lib/questions/questionGroup_reflection';
import {Router} from '@angular/router';

@Component({
  selector: 'app-session-management',
  templateUrl: './session-management.component.html',
  styleUrls: ['./session-management.component.scss']
})
export class SessionManagementComponent implements OnInit {
  get sessions(): Array<string> {
    return this._sessions;
  }

  private _sessions: Array<string> = [];

  constructor(
    private footerBarService: FooterBarService,
    private translateService: TranslateService,
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private router: Router) {
    footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemHome,
      FooterBarComponent.footerElemAbout,
      FooterBarComponent.footerElemTranslation,
      FooterBarComponent.footerElemTheme,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemImport,
    ]);
    headerLabelService.setHeaderLabel('component.hashtag_management.session_management');
    this._sessions = JSON.parse(window.localStorage.getItem('owned_quizzes')) || [];
  }

  ngOnInit() {
  }

  startQuiz(session: string): void {
    const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));
    this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
    this.router.navigate(['/quiz-lobby']);
  }

  editQuiz(session: string): void {
    const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));
    this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
    this.router.navigate(['/quiz-manager']);
  }

  exportQuiz(session: string): void {
    const exportData = 'text/json;charset=utf-8,' + encodeURIComponent(window.localStorage.getItem(session));
    const a = document.createElement('a');
    const time = new Date();
    const timestring = time.getDate() + '_' + (time.getMonth() + 1) + '_' + time.getFullYear();
    a.href = 'data:' + exportData;
    a.download = session + '-' + timestring + '.json';
    a.addEventListener('click', function () {
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(new Blob([exportData], {type: 'text/json'}), session + '-' + timestring + '.json');
      }
    });
    a.innerHTML = '';
    a.click();
  }

  deleteQuiz(session: string): void {
    this.sessions.splice(this.sessions.indexOf(session), 1);
    window.localStorage.removeItem(session);
    window.localStorage.setItem('owned_quizzes', JSON.stringify(this.sessions));
  }
}
