import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {AttendeeService} from 'app/service/attendee.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {DefaultSettings} from '../../../service/settings.service';
import {Http} from '@angular/http';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from '../../../service/current-quiz.service';

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
    private http: Http,
    public attendeeService: AttendeeService) {

    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this._hashtag = this.activeQuestionGroupService.activeQuestionGroup.hashtag;
      this.footerBarService.replaceFooterElments([
        FooterBarComponent.footerElemBack,
        FooterBarComponent.footerElemFullscreen,
        FooterBarComponent.footerElemExport
      ]);
    } else {
      this._hashtag = this.currentQuizService.hashtag;
      this.footerBarService.replaceFooterElments([
        FooterBarComponent.footerElemBack,
        FooterBarComponent.footerElemFullscreen
      ]);
    }
    this._leaderBoard = [];
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._isGlobalRanking = isNaN(this._questionIndex);
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/${this._hashtag}/${this._questionIndex}`)
          .map(res => res.json())
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
