import {Component, EventEmitter, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {FooterBarService} from '../../service/footer-bar.service';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {IQuestion} from '../../../lib/questions/interfaces';
import {AttendeeService, INickname} from '../../service/attendee.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {ISessionConfiguration} from '../../../lib/session_configuration/interfaces';
import {DefaultSettings} from '../../service/settings.service';
import {HttpClient} from '@angular/common/http';
import {ConnectionService} from '../../service/connection.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

export class Countdown {

  private _isRunning: boolean;
  private _time: number;
  private _remainingTime: number;

  public onChange = new EventEmitter<number>();

  constructor(question: IQuestion, questionIndex: number) {
    this._time = question.timer;
    // Get starting timestamp and current timestamp from server
    const startTimestamp = new Date().getTime();
    const endTimestamp = startTimestamp + this._time * 1000;
    this._remainingTime = (endTimestamp - startTimestamp) / 1000;
    this._isRunning = true;
    const interval = setInterval(() => {
      this._remainingTime--;
      this.onChange.next(this._remainingTime);
      if (!this._remainingTime) {
        this._isRunning = false;
        clearInterval(interval);
      }
    }, 1000);
  }
}

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit, OnDestroy {
  get countdownValue(): number {
    return this._countdownValue;
  }
  get isActiveQuiz(): boolean {
    return this._isActiveQuiz;
  }
  get sessionConfig(): ISessionConfiguration {
    return this._sessionConfig;
  }
  get questions(): Array<IQuestion> {
    return this._questions;
  }

  private _sessionConfig: ISessionConfiguration;
  private _questions: Array<IQuestion>;
  private _currentQuestionIndex = 0;
  private _countdown: Countdown;
  private _countdownValue: number;
  private _isActiveQuiz = true;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private http: HttpClient,
              private headerLabelService: HeaderLabelService,
              private connectionService: ConnectionService,
              private footerBarService: FooterBarService,
              private attendeeService: AttendeeService) {
    this.footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack,
      FooterBarComponent.footerElemReadingConfirmation,
      FooterBarComponent.footerElemConfidenceSlider,
      FooterBarComponent.footerElemResponseProgress,
      FooterBarComponent.footerElemFullscreen,
      FooterBarComponent.footerElemSound,
    ]);
    this._questions = [];
    headerLabelService.setHeaderLabel('component.liveResults.title');
  }

  showLeaderBoardButton(elem: IQuestion): boolean {
    return ['SurveyQuestion'].indexOf(elem.TYPE) === -1;
  }

  showQuestionButton(elem: IQuestion): boolean {
    return ['ABCDQuestion'].indexOf(elem.TYPE) === -1;
  }

  showConfidenceRate(): boolean {
    return this._sessionConfig.confidenceSliderEnabled;
  }

  getConfidenceData(questionIndex: number): Object {
    const matches = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence : false;
    });
    const absoluteValues = matches.length ? this.attendeeService.attendees.map(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence : 0;
    }).reduce((currentValue, nextValue) => {
      return currentValue + nextValue;
    }) : 0;
    return {
      absolute: matches.length,
      base: this.attendeeService.attendees.length,
      percent: absoluteValues / matches.length
    };
  }

  showReadingConfirmation(): boolean {
    return this._sessionConfig.readingConfirmationEnabled;
  }

  showResponseProgress(): boolean {
    return this._sessionConfig.showResponseProgress;
  }

  getReadingConfirmationData(questionIndex: number): Object {
    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    return {
      absolute: matchCount,
      base: this.attendeeService.attendees.length,
      percent: matchCount / this.attendeeService.attendees.length
    };
  }

  private handleResponseUpdates() {
    this.connectionService.socket.next({
      step: 'LOBBY:GET_PLAYERS'
    });
    this.connectionService.socket.subscribe((message) => {
      const data = message;
      switch (data.step) {
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach(nickname => {
            this.attendeeService.addMember(nickname);
          });
          console.log(this.attendeeService);
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
      }
    });
  }

  private sendDummyTestData(): void {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this.activeQuestionGroupService.activeQuestionGroup.hashtag,
      nickname: 'testnick',
      questionIndex: this._currentQuestionIndex,
      value: 0,
      responseTime: 500,
      confidence: 80,
      readingConfirmation: false
    }).subscribe(
      (data: IMessage) => {
        console.log(data);
      }
    );
  }

  ngOnInit() {
    this.connectionService.initConnection().then(() => {
      if (this.activeQuestionGroupService.activeQuestionGroup) {
        this._sessionConfig = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig;
        this._questions = this.activeQuestionGroupService.activeQuestionGroup.questionList;
        this._countdown = new Countdown(this.questions[this._currentQuestionIndex], this._currentQuestionIndex);
        this._countdown.onChange.subscribe((value) => {
          this._countdownValue = value;
        });
        setTimeout(() => {
          this.sendDummyTestData();
        }, 1500);
      }
      setTimeout(() => this.handleResponseUpdates(), 1000);
    });
  }

  ngOnDestroy() {
  }

}
