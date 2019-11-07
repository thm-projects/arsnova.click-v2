import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { QuizState } from '../../../lib/enums/QuizState';
import { ILeaderBoardItem } from '../../../lib/interfaces/ILeaderboard';
import { parseGithubFlavoredMarkdown } from '../../../lib/markdown/markdown';
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
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  public static TYPE = 'LeaderboardComponent';
  public isLoadingData = true;

  private _questionIndex: number;
  private readonly _destroy = new Subject();

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

  private _ownResponse: { index: number, element: ILeaderBoardItem, closestOpponent: ILeaderBoardItem };

  get ownResponse(): { index: number; element: ILeaderBoardItem; closestOpponent: ILeaderBoardItem } {
    return this._ownResponse;
  }

  private _serverUnavailableModal: NgbModalRef;
  private _name: string;
  private readonly _messageSubscriptions: Array<string> = [];

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
    private ngbModal: NgbModal, private messageQueue: SimpleMQ,
  ) {
    this.footerBarService.TYPE_REFERENCE = LeaderboardComponent.TYPE;
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.router.navigate(['/']);
        return;
      }

      this._name = this.quizService.quiz.name;
      this.initData();
      this.addFooterElements();
    });

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.handleMessages();
    });

    this.connectionService.serverStatusEmitter.pipe(takeUntil(this._destroy)).subscribe(isConnected => {
      if (isConnected) {
        if (this._serverUnavailableModal) {
          this._serverUnavailableModal.dismiss();
        }
        return;
      } else if (!isConnected && this._serverUnavailableModal) {
        return;
      }

      this.ngbModal.dismissAll();
      this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent, {
        keyboard: false,
        backdrop: 'static',
      });
      this._serverUnavailableModal.result.finally(() => this._serverUnavailableModal = null);
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();

    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
    this._destroy.next();
    this._destroy.complete();
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

  public hasOwnResponse(): boolean {
    return Object.keys(this._ownResponse || {}).length > 1;
  }

  private initData(): void {
    this.route.params.pipe(takeUntil(this._destroy)).subscribe(params => {

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
      }

      this.leaderboardApiService.getLeaderboardData(this._name, environment.leaderboardAmount, this.questionIndex).subscribe(lederboardData => {
        this._leaderBoardCorrect = lederboardData.payload.correctResponses;
        this._ownResponse = lederboardData.payload.ownResponse;
        this._memberGroupResults = lederboardData.payload.memberGroupResults;

        this._memberGroupResults = this._memberGroupResults.filter(memberGroupResult => {
          return memberGroupResult.correctQuestions.length > 0;
        });

        this.isLoadingData = false;
      });
    });
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      }),
      this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        console.log('LeaderboardComponent: modify response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        if (isPlatformBrowser(this.platformId)) {
          const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
          if (existingNickname === payload.name) {
            this.router.navigate(['/']);
          }
        }
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.router.navigate(['/']);
      }),
    ]);
  }

  private addFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.router.navigate(['/quiz', 'flow', 'results']);
    };

    if (this.quizService.isOwner && this._isGlobalRanking) {
      footerElements.push(this.footerBarService.footerElemExport);
    }

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
