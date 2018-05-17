import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {AttendeeService} from '../../../service/attendee.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {DefaultSettings} from '../../../../lib/default.settings';
import {IMessage, ILeaderBoardItem} from 'arsnova-click-v2-types/src/common';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {ConnectionService} from '../../../service/connection.service';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';
import {I18nService} from '../../../service/i18n.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  get hasMultipleAnswersAvailable(): boolean {
    return this._hasMultipleAnswersAvailable;
  }
  public static TYPE = 'LeaderboardComponent';

  get memberGroupResults(): Array<ILeaderBoardItem> {
    return this._memberGroupResults;
  }
  get questionIndex(): number {
    return this._questionIndex;
  }

  get isGlobalRanking(): boolean {
    return this._isGlobalRanking;
  }

  get leaderBoardPartiallyCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardPartiallyCorrect;
  }

  get leaderBoardCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardCorrect;
  }

  private _routerSubscription: Subscription;
  private _questionIndex: number;
  private _leaderBoardCorrect: Array<ILeaderBoardItem>;
  private _leaderBoardPartiallyCorrect: Array<ILeaderBoardItem>;
  private _memberGroupResults: Array<ILeaderBoardItem>;
  private _isGlobalRanking: boolean;
  private _hasMultipleAnswersAvailable: boolean;
  private readonly _hashtag: string;

  constructor(
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private http: HttpClient,
    private router: Router,
    private connectionService: ConnectionService,
    public currentQuizService: CurrentQuizService,
    public attendeeService: AttendeeService,
    private i18nService: I18nService
  ) {

    this.footerBarService.TYPE_REFERENCE = LeaderboardComponent.TYPE;

    this._hashtag = this.currentQuizService.quiz.hashtag;
    this._leaderBoardCorrect = [];
    this._leaderBoardPartiallyCorrect = [];

    if (this.currentQuizService.isOwner) {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack,
        this.footerBarService.footerElemFullscreen,
        this.footerBarService.footerElemExport
      ]);
    } else {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack,
        this.footerBarService.footerElemFullscreen
      ]);
    }
  }

  private handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in leaderboard view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case 'LOBBY:CLOSED':
          this.router.navigate(['/']);
          break;
      }
    });
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  parseNickname(value: string): SafeHtml {
    if (value.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  roundResponseTime(value: number | Array<string>, exp: number): number {
    value = +value;

    if (typeof exp === 'undefined' || +exp === 0) {
      return Math.round(value);
    }

    if (isNaN(value) || !(exp % 1 === 0)) {
      return NaN;
    }

    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });
    this._routerSubscription = this.route.params.subscribe(params => {
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

        const questionType = this.currentQuizService.quiz.questionList[this.questionIndex].TYPE;
        this._hasMultipleAnswersAvailable = questionType === 'MultipleChoiceQuestion';
      }


      const url = `${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/${this._hashtag}/${this._questionIndex ? this._questionIndex : ''}`;
      this.http.get(url)
          .subscribe(
            (data: IMessage) => {
              this._leaderBoardCorrect = data.payload.correctResponses;
              this._leaderBoardPartiallyCorrect = data.payload.partiallyCorrectResponses;
              this._memberGroupResults = data.payload.memberGroupResults;

              this._leaderBoardPartiallyCorrect.forEach(partiallyCorrectLeaderboardElement => {
                this._leaderBoardCorrect.forEach((allLeaderboardElements, index) => {
                  if (partiallyCorrectLeaderboardElement.name === allLeaderboardElements.name) {
                    this._leaderBoardCorrect.splice(index, 1);
                  }
                });
              });

              this._memberGroupResults = this._memberGroupResults.filter(memberGroupResult => {
                return memberGroupResult.correctQuestions.length > 0;
              });
            }
          );
    });
  }

  private formatResponseTime(responseTime: number): string {
    return this.i18nService.formatNumber(parseFloat(responseTime.toFixed(2)));
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}