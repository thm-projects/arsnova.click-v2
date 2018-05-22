import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { Observable, of } from 'rxjs/index';
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
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));
    return questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized).isValid();
  }

  public startQuiz(sessionName: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const sessionSerialized = JSON.parse(window.localStorage.getItem(sessionName));
    const session = new questionGroupReflection[sessionSerialized.TYPE](sessionSerialized);

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `start-quiz`,
    });

    return new Observable<any>(subscriber => {

      of(this.requestQuizStatus(session).subscribe(() => {
          this.currentQuizService.quiz = session;
          this.currentQuizService.cacheQuiz().then(() => {

            this.openLobby(session).subscribe(() => {
              subscriber.complete();

            }, (data) => subscriber.error(data));
          });

        }, (data) => subscriber.error(data)),
      );
    });
  }

  public editQuiz(session: string): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const questionGroupSerialized = JSON.parse(window.localStorage.getItem(session));

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `edit-quiz`,
    });

    this.activeQuestionGroupService.activeQuestionGroup = questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
    this.router.navigate(['/quiz', 'manager']);
  }

  public exportQuiz(session: string, onClick?: (self: HTMLAnchorElement, event: MouseEvent) => void): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const a = document.createElement('a');
    const time = new Date();
    const type = 'text/json';
    const exportData = `${type};charset=utf-8,${encodeURIComponent(window.localStorage.getItem(session))}`;
    const timestring = time.getDate() + '_' + (time.getMonth() + 1) + '_' + time.getFullYear();
    const fileName = `${session}-${timestring}.json`;

    a.href = 'data:' + exportData;
    a.download = fileName;
    a.addEventListener<'click'>('click', function (this: HTMLAnchorElement, event: MouseEvent): void {
      if (onClick) {
        onClick(this, event);
      }
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(new Blob([exportData], { type }), fileName);
      }
    });
    a.innerHTML = '';
    a.click();

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `export-quiz`,
    });
  }

  public deleteQuiz(session: string): void {
    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `delete-quiz`,
    });

    this.sessions.splice(this.sessions.indexOf(session), 1);

    if (isPlatformServer(this.platformId)) {
      return;
    }

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

  private requestQuizStatus(session: IQuestionGroup): Observable<any> {
    return new Observable<any>(subscriber => {
      subscriber.next(this.http.get<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/status/${session.hashtag}`).subscribe(data => {
          if (data.status !== 'STATUS:SUCCESSFUL') {
            subscriber.error(data);
            return;
          }

          if (data.step !== 'QUIZ:UNDEFINED') {
            subscriber.complete();
            return;
          }

          this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/reserve/override`, {
            quizName: session.hashtag,
            privateKey: window.localStorage.getItem('config.private_key'),
          }).subscribe((reserveResponse: IMessage) => {

            if (reserveResponse.status === 'STATUS:SUCCESSFUL') {
              subscriber.complete();
              return;
            }

            subscriber.error([data, reserveResponse]);
          });
        }, error => subscriber.error(error)),
      );
    });
  }

  private openLobby(session: IQuestionGroup): Observable<any> {
    return new Observable<any>(subscriber => {
      subscriber.next(
        this.http.put<IMessage>(`${DefaultSettings.httpApiEndpoint}/lobby`, {
          quiz: session.serialize(),
        }).subscribe(
          data => {
            if (data.status === 'STATUS:SUCCESSFUL') {
              this.router.navigate(['/quiz', 'flow']);
              subscriber.complete();
              return;
            }
            subscriber.error(data);
          },
        ),
      );
    });
  }
}
