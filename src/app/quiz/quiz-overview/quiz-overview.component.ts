import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { DefaultSettings } from '../../../lib/default.settings';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: ['./quiz-overview.component.scss'],
})
export class QuizOverviewComponent {
  public static TYPE = 'QuizOverviewComponent';

  get sessions(): Array<string> {
    return this._sessions;
  }

  private readonly _sessions: Array<string> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private http: HttpClient,
    private headerLabelService: HeaderLabelService,
    private currentQuizService: CurrentQuizService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private router: Router,
    private trackingService: TrackingService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizOverviewComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemAbout,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemImport,
    ]);
    headerLabelService.headerLabel = 'component.hashtag_management.session_management';
    if (isPlatformBrowser(this.platformId)) {
      this._sessions = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
    }
  }

  public isValid(session: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));
      return questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized).isValid();
    }
  }

  public startQuiz(sessionName: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const sessionSerialized = JSON.parse(window.localStorage.getItem(sessionName));
      const session = new questionGroupReflection[sessionSerialized.TYPE](sessionSerialized);

      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `start-quiz`,
      });
      const run = async () => {
        await new Promise((resolve, reject) => {
          this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/status/${session.hashtag}`).subscribe((data: IMessage) => {
            if (data.status === 'STATUS:SUCCESSFUL') {
              if (data.step === 'QUIZ:UNDEFINED') {
                this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/reserve/override`, {
                  quizName: session.hashtag,
                  privateKey: window.localStorage.getItem('config.private_key'),
                }).subscribe((reserveResponse: IMessage) => {
                  if (reserveResponse.status === 'STATUS:SUCCESSFUL') {
                    resolve();
                  } else {
                    reject([data, reserveResponse]);
                  }
                });
              } else {
                resolve();
              }
            } else {
              reject(data);
            }
          });
        }).catch(reason => {
          console.log(reason);
        });

        this.currentQuizService.quiz = session;
        await this.currentQuizService.cacheQuiz();
        this.http.put(`${DefaultSettings.httpApiEndpoint}/lobby`, {
          quiz: session.serialize(),
        }).subscribe(
          (data: IMessage) => {
            if (data.status === 'STATUS:SUCCESSFUL') {
              this.router.navigate(['/quiz', 'flow']);
            }
          },
        );
      };

      run();
    }
  }

  public editQuiz(session: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));
      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `edit-quiz`,
      });
      this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
      this.router.navigate(['/quiz', 'manager']);
    }
  }

  public exportQuiz(session: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const exportData = 'text/json;charset=utf-8,' + encodeURIComponent(window.localStorage.getItem(session));
      const a = document.createElement('a');
      const time = new Date();
      const timestring = time.getDate() + '_' + (time.getMonth() + 1) + '_' + time.getFullYear();
      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `export-quiz`,
      });
      a.href = 'data:' + exportData;
      a.download = session + '-' + timestring + '.json';
      a.addEventListener('click', () => {
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(new Blob([exportData], { type: 'text/json' }), session + '-' + timestring + '.json');
        }
      });
      a.innerHTML = '';
      a.click();
    }
  }

  public deleteQuiz(session: string): void {
    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `delete-quiz`,
    });
    this.sessions.splice(this.sessions.indexOf(session), 1);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(session);
      window.localStorage.setItem('config.owned_quizzes', JSON.stringify(this.sessions));
      this.http.request('delete', `${DefaultSettings.httpApiEndpoint}/quiz`, {
        body: {
          quizName: session,
          privateKey: localStorage.getItem('config.private_key'),
        },
      }).subscribe((response: IMessage) => {
        if (response.status !== 'STATUS:SUCCESSFUL') {
          console.log(response);
        }
      });
    }
  }
}
