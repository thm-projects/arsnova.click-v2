import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ILeaderBoardItem } from 'arsnova-click-v2-types/dist/common';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol } from '../../../../lib/enums/Message';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { LeaderboardApiService } from '../../../service/api/leaderboard/leaderboard-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class LeaderboardComponent implements OnDestroy {
  public static TYPE = 'LeaderboardComponent';

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  private _leaderBoardCorrect: Array<ILeaderBoardItem> = [];

  get leaderBoardCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardCorrect;
  }

  private _memberGroupResults: Array<ILeaderBoardItem>;

  get memberGroupResults(): Array<ILeaderBoardItem> {
    return this._memberGroupResults;
  }

  private _isGlobalRanking: boolean;

  get isGlobalRanking(): boolean {
    return this._isGlobalRanking;
  }

  private _hasMultipleAnswersAvailable: boolean;

  get hasMultipleAnswersAvailable(): boolean {
    return this._hasMultipleAnswersAvailable;
  }

  private _serverUnavailableModal: NgbModalRef;
  private _name: string;

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public attendeeService: AttendeeService,
    public quizService: QuizService,
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private connectionService: ConnectionService,
    private i18nService: I18nService,
    private leaderboardApiService: LeaderboardApiService,
    private ngbModal: NgbModal,
  ) {

    this.footerBarService.TYPE_REFERENCE = LeaderboardComponent.TYPE;

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._name = this.quizService.quiz.name;
      this.initData();
      this.attendeeService.restoreMembers();
      this.addFooterElements();
    }));

    this._subscriptions.push(this.connectionService.serverStatusEmitter.subscribe(isConnected => {
      if (isConnected) {
        if (this._serverUnavailableModal) {
          this._serverUnavailableModal.dismiss();
        }
        return;
      } else if (!isConnected && this._serverUnavailableModal) {
        return;
      }

      this.ngbModal.dismissAll();
      this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent);
      this._serverUnavailableModal.result.finally(() => this._isServerUnavailableModalOpen = false);
    }));
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseNickname(value: string): SafeHtml {
    if (value.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  public roundResponseTime(value: number, digits?: number): number;
  public roundResponseTime(value: Array<string>, digits?: number): number;
  public roundResponseTime(value: number | Array<string>, digits?: number): number {
    value = +value;

    if (typeof digits === 'undefined' || +digits === 0) {
      return Math.round(value);
    }

    if (isNaN(value) || !(digits % 1 === 0)) {
      return NaN;
    }

    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + digits) : digits)));

    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - digits) : -digits));
  }

  public formatResponseTime(responseTime: number): string {
    return this.i18nService.formatNumber(this.roundResponseTime(responseTime, 2));
  }

  private initData(): void {
    this.route.params.subscribe(params => {

      this.connectionService.initConnection().then(() => {
        this.connectionService.connectToChannel(this.quizService.quiz.name);
        this.handleMessages();
      });

      this._questionIndex = +params['questionIndex'];
      this._isGlobalRanking = isNaN(this._questionIndex);
      if (this._isGlobalRanking) {
        this.headerLabelService.headerLabel = 'component.leaderboard.global_header';
        this._questionIndex = null;
        if (params['questionIndex']) {
          this.router.navigate(['/quiz', 'flow', 'leaderboard']);
          return;
        }
      } else {
        this.headerLabelService.headerLabel = 'component.leaderboard.header';

        const questionType = this.quizService.quiz.questionList[this.questionIndex].TYPE;
        this._hasMultipleAnswersAvailable = questionType === QuestionType.MultipleChoiceQuestion;
      }

      this.leaderboardApiService.getLeaderboardData(this._name, this.questionIndex).subscribe(lederboardData => {
        this._leaderBoardCorrect = lederboardData.payload.correctResponses;
        this._memberGroupResults = lederboardData.payload.memberGroupResults;

        this._memberGroupResults = this._memberGroupResults.filter(memberGroupResult => {
          return memberGroupResult.correctQuestions.length > 0;
        });
      });
    });
  }

  private handleMessages(): void {
    this._subscriptions.push(this.connectionService.dataEmitter.subscribe((data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.Start:
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case MessageProtocol.UpdatedResponse:
          console.log('modify response data for nickname in leaderboard view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload);
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case MessageProtocol.Removed:
          if (isPlatformBrowser(this.platformId)) {
            const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
            if (existingNickname === data.payload.name) {
              this.router.navigate(['/']);
            }
          }
          break;
        case MessageProtocol.Closed:
          this.router.navigate(['/']);
          break;
      }
    }));
  }

  private addFooterElements(): void {
    if (this.quizService.isOwner) {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen, this.footerBarService.footerElemExport,
      ]);
    } else {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen,
      ]);
    }
  }
}
