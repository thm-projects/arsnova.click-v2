import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { IQuestionGroup } from 'arsnova-click-v2-types/src/questions';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { StorageService } from '../../service/storage/storage.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: ['./quiz-overview.component.scss'],
})
export class QuizOverviewComponent implements OnInit {
  public static TYPE = 'QuizOverviewComponent';

  private _sessions: Array<IQuestionGroup> = [];

  get sessions(): Array<IQuestionGroup> {
    return this._sessions;
  }

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
    private storageService: StorageService,
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
  }

  public startQuiz(index: number): Promise<void> {
    return new Promise(async resolve => {
      if (isPlatformServer(this.platformId)) {
        resolve();
        return;
      }

      this.trackingService.trackClickEvent({
        action: QuizOverviewComponent.TYPE,
        label: `start-quiz`,
      });

      const quizAvailable = await this.requestQuizStatus(this.sessions[index]);
      if (!quizAvailable) {
        resolve();
        return;
      }

      this.currentQuizService.quiz = this.sessions[index];
      await this.currentQuizService.cacheQuiz();
      await this.openLobby(this.sessions[index]);

      resolve();
    });
  }

  public editQuiz(index: number): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `edit-quiz`,
    });

    this.activeQuestionGroupService.activeQuestionGroup = this.sessions[index];
    this.router.navigate(['/quiz', 'manager']);
  }

  public async exportQuiz(index: number, onClick?: (self: HTMLAnchorElement, event: MouseEvent) => void): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const a = document.createElement('a');
    const time = new Date();
    const type = 'text/json';
    const sessionName = this.sessions[index].hashtag;
    const exportData = `${type};charset=utf-8,${encodeURIComponent(JSON.stringify(this.sessions[index].serialize()))}`;
    const timestring = time.getDate() + '_' + (
                       time.getMonth() + 1
    ) + '_' + time.getFullYear();
    const fileName = `${sessionName}-${timestring}.json`;

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

  public async deleteQuiz(index: number): Promise<void> {
    this.trackingService.trackClickEvent({
      action: QuizOverviewComponent.TYPE,
      label: `delete-quiz`,
    });

    if (isPlatformServer(this.platformId)) {
      return;
    }

    const sessionName = this.sessions[index].hashtag;

    this.sessions.splice(index, 1);
    this.storageService.delete(DB_TABLE.QUIZ, sessionName).subscribe();
    this.quizApiService.deleteQuiz({
      body: {
        quizName: sessionName,
        privateKey: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise(),
      },
    }).subscribe((response: IMessage) => {
      if (response.status !== COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
        console.log(response);
      }
    });
  }

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.getAll(DB_TABLE.QUIZ).subscribe((rawSessions) => {
        rawSessions.forEach(session => {
          this._sessions.push(questionGroupReflection[session.value.TYPE](session.value));
        });
      });
    }
  }

  private async requestQuizStatus(session: IQuestionGroup): Promise<boolean> {
    const quizStatusResponse = await this.quizApiService.getQuizStatus(session.hashtag).toPromise();
    if (quizStatusResponse.status !== COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
      return false;
    }
    if (quizStatusResponse.step === COMMUNICATION_PROTOCOL.QUIZ.EXISTS) {
      return true;
    }
    if (quizStatusResponse.step !== COMMUNICATION_PROTOCOL.QUIZ.UNDEFINED) {
      return false;
    }

    await this.quizApiService.postQuizReservationOverride({
      quizName: session.hashtag,
      privateKey: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise(),
    }).toPromise();

    return true;
  }

  private async openLobby(session: IQuestionGroup): Promise<any> {
    const lobbyResponse = await this.lobbyApiService.putLobby({
      quiz: session.serialize(),
    }).toPromise();

    if (lobbyResponse.status === COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL) {
      this.router.navigate(['/quiz', 'flow']);
    }
  }
}
