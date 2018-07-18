import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ILeaderBoardItem, IMessage } from 'arsnova-click-v2-types/src/common';
import { Subscription } from 'rxjs';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { LeaderboardApiService } from '../../../service/api/leaderboard/leaderboard-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  public static TYPE = 'LeaderboardComponent';

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  private _leaderBoardCorrect: Array<ILeaderBoardItem>;

  get leaderBoardCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardCorrect;
  }

  private _leaderBoardPartiallyCorrect: Array<ILeaderBoardItem>;

  get leaderBoardPartiallyCorrect(): Array<ILeaderBoardItem> {
    return this._leaderBoardPartiallyCorrect;
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

  private _routerSubscription: Subscription;
  private readonly _hashtag: string;

  constructor(
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private connectionService: ConnectionService,
    public currentQuizService: CurrentQuizService,
    public attendeeService: AttendeeService,
    private i18nService: I18nService,
    private leaderboardApiService: LeaderboardApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = LeaderboardComponent.TYPE;

    this._hashtag = this.currentQuizService.quiz.hashtag;
    this._leaderBoardCorrect = [];
    this._leaderBoardPartiallyCorrect = [];

    this.currentQuizService.isOwner.subscribe(value => {
      if (value) {
        this.footerBarService.replaceFooterElements([
          this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen, this.footerBarService.footerElemExport,
        ]);
      } else {
        this.footerBarService.replaceFooterElements([
          this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen,
        ]);
      }
    });
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

    if (isNaN(value) || !(
      digits % 1 === 0
    )) {
      return NaN;
    }

    value = value.toString().split('e');
    value = Math.round(+(
      value[0] + 'e' + (
        value[1] ? (
      +value[1] + digits
        ) : digits
      )
    ));

    value = value.toString().split('e');
    return +(
      value[0] + 'e' + (
        value[1] ? (
          +value[1] - digits
        ) : -digits
      )
    );
  }

  public ngOnInit(): void {
    this.connectionService.initConnection().then(() => {
      this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      this.handleMessages();
    });

    this.route.params.subscribe(params => {
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

    });

    this.leaderboardApiService.getLeaderboardData(this._hashtag, this.questionIndex).subscribe(lederboardData => {
      this._leaderBoardCorrect = lederboardData.payload.correctResponses;
      this._leaderBoardPartiallyCorrect = lederboardData.payload.partiallyCorrectResponses;
      this._memberGroupResults = lederboardData.payload.memberGroupResults;
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
    });
  }

  public formatResponseTime(responseTime: number): string {
    return this.i18nService.formatNumber(this.roundResponseTime(responseTime, 2));
  }

  private handleMessages(): void {
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

}
