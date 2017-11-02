import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {AttendeeService} from 'app/service/attendee.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {DefaultSettings} from '../../../service/settings.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {ConnectionService} from '../../../service/connection.service';
import {HttpClient} from '@angular/common/http';

export interface ILeaderBoardItem {
  name: string;
  responseTime: number;
}

export interface ILeaderBoard {
  attendees: Array<ILeaderBoardItem>;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  get questionIndex(): number {
    return this._questionIndex;
  }

  get isGlobalRanking(): boolean {
    return this._isGlobalRanking;
  }

  get leaderBoard(): Array<ILeaderBoard> {
    return this._leaderBoard;
  }

  private _routerSubscription: Subscription;
  private _questionIndex: number;
  private _leaderBoard: Array<ILeaderBoard>;
  private _isGlobalRanking: boolean;
  private _hashtag: string;

  constructor(
    private footerBarService: FooterBarService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private router: Router,
    private connectionService: ConnectionService,
    public attendeeService: AttendeeService) {

    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this._hashtag = this.activeQuestionGroupService.activeQuestionGroup.hashtag;
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack,
        this.footerBarService.footerElemFullscreen,
        this.footerBarService.footerElemExport
      ]);
    } else {
      this._hashtag = this.currentQuizService.hashtag;
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack,
        this.footerBarService.footerElemFullscreen
      ]);
    }
    this._leaderBoard = [];
  }

  private handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'QUIZ:START':
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname in confidence rate view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case 'LOBBY:CLOSED':
          this.router.navigate(['/']);
          break;
      }
    });
  }

  ngOnInit() {
    this.connectionService.authorizeWebSocket(this.currentQuizService.hashtag);
    this.handleMessages();
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._isGlobalRanking = isNaN(this._questionIndex);
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/${this._hashtag}/${this._questionIndex}`)
          .subscribe(
            (data: IMessage) => {
              this._leaderBoard = data.payload;
            },
            error => {
              console.log(error);
            }
          );
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
