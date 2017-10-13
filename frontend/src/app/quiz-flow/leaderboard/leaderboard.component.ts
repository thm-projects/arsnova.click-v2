import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {AttendeeService} from 'app/service/attendee.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {DefaultSettings} from '../../service/settings.service';
import {Http} from '@angular/http';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';

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

  constructor(private footerBarService: FooterBarService,
              private route: ActivatedRoute,
              private headerLabelService: HeaderLabelService,
              private activeQuestionGroupService: ActiveQuestionGroupService,
              private http: Http,
              private attendeeService: AttendeeService) {
    this.footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemExport
    ]);
    this._leaderBoard = [];
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._isGlobalRanking = isNaN(this._questionIndex);
      const hashtag = this.activeQuestionGroupService.activeQuestionGroup.hashtag;
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/${hashtag}/${this._questionIndex}`)
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
