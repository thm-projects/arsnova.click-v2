import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
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
    private headerLabelService: HeaderLabelService,
    private currentQuizService: CurrentQuizService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private router: Router,
    private trackingService: TrackingService,
    private quizApiService: QuizApiService,
    private lobbyApiService: LobbyApiService,
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

  public async startQuiz(sessionName: string): Promise<any> {
    return new Promise(async resolve => {
      if (isPlatformServer(this.platformId)) {
        resolve();
        return;
      }

      const sessionSerialized = JSON.parse(window.localStorage.getItem(sessionName));
      const session = new questionGroupReflection[sessionSerialized.TYPE](sessionSerialized);

      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `start-quiz`,
      });

      const quizAvailable = await this.requestQuizStatus(session);
      if (!quizAvailable) {
        resolve();
        return;
      }

      this.currentQuizService.quiz = session;
      await this.currentQuizService.cacheQuiz();
      await this.openLobby(session);

      resolve();
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
    this.quizApiService.deleteQuiz({
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

  private async requestQuizStatus(session: IQuestionGroup): Promise<boolean> {
    const quizStatusResponse = await this.quizApiService.getQuizStatus(session.hashtag).toPromise();
    if (quizStatusResponse.status !== 'STATUS:SUCCESSFUL' || quizStatusResponse.step !== 'QUIZ:UNDEFINED') {
      return false;
    }

    await this.quizApiService.postQuizReservationOverride({
      quizName: session.hashtag,
      privateKey: window.localStorage.getItem('config.private_key'),
    }).toPromise();

    return true;
  }

  private async openLobby(session: IQuestionGroup): Promise<any> {
    const lobbyResponse = await this.lobbyApiService.putLobby({
      quiz: session.serialize(),
    }).toPromise();

    if (lobbyResponse.status === 'STATUS:SUCCESSFUL') {
      this.router.navigate(['/quiz', 'flow']);
    }
  }
}
