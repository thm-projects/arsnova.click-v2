import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { QuizState } from '../../../lib/enums/QuizState';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
import { ILeaderBoardItem } from '../../../lib/interfaces/ILeaderboard';
import { IMemberGroupBase } from '../../../lib/interfaces/users/IMemberGroupBase';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { LeaderboardApiService } from '../../../service/api/leaderboard/leaderboard-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {

  get questionIndex(): number {
    return this._questionIndex;
  }

  get leaderBoardCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardCorrect;
  }

  get memberGroupResults(): Array<ILeaderBoardItem> {
    return this._memberGroupResults;
  }

  get ownResponse(): { index: number; element: ILeaderBoardItem; closestOpponent: ILeaderBoardItem } {
    return this._ownResponse;
  }
  public static readonly TYPE = 'LeaderboardComponent';

  private _questionIndex: number;
  private _leaderBoardCorrect: Array<ILeaderBoardItem> = [];
  private _memberGroupResults: Array<ILeaderBoardItem>;
  private _isGlobalRanking: boolean;
  private _ownResponse: { index: number, element: ILeaderBoardItem, closestOpponent: ILeaderBoardItem };
  private _serverUnavailableModal: NgbModalRef;
  private _name: string;
  private readonly _destroy = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];

  public isLoadingData = true;
  public hasTriggeredNavigation: boolean;
  public absolute: number;

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
    private messageQueue: SimpleMQ,
    private customMarkdownService: CustomMarkdownService,
  ) {
    this.footerBarService.TYPE_REFERENCE = LeaderboardComponent.TYPE;
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      this._name = this.quizService.quiz.name;
      this.initData();
      this.addFooterElements();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
        this.handleMessages();
      }).catch(() => this.hasTriggeredNavigation = true);
    }

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

  public sanitizeHTML(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseNickname(value: string): string {
    if (value?.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(value));
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

  public sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }

  public getPercentForGroup(group: ILeaderBoardItem): number {
    return Math.round(group.score / this.absolute * 100);
  }

  public getTeam(group: ILeaderBoardItem): IMemberGroupBase {
    return this.quizService.quiz?.sessionConfig.nicks.memberGroups.find(value => value.name === group.name);
  }

  private initData(): void {

    this.route.paramMap.pipe(map(params => parseInt(params.get('questionIndex'), 10)), distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe(questionIndex => {
        this._questionIndex = questionIndex;
        this._isGlobalRanking = isNaN(this._questionIndex);
        if (this._isGlobalRanking) {
          this.headerLabelService.headerLabel = 'component.leaderboard.global_header';
          this._questionIndex = null;
          if (!!questionIndex) {
            this.hasTriggeredNavigation = true;
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
          this.absolute = Math.max(...this._memberGroupResults.map(value => value.score));

          this.isLoadingData = false;
        });
      });
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        console.log('LeaderboardComponent: modify response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === payload.name) {
          this.hasTriggeredNavigation = true;
          this.router.navigate(['/']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }),
    ]);
  }

  private addFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.footerElemBack.onClickCallback = () => {
      this.hasTriggeredNavigation = true;
      this.router.navigate(['/quiz', 'flow', 'results']);
    };

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
