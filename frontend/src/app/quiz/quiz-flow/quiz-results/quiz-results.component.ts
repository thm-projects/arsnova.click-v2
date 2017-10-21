import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {FooterBarComponent} from '../../../footer/footer-bar/footer-bar.component';
import {IQuestion} from '../../../../lib/questions/interfaces';
import {AttendeeService} from '../../../service/attendee.service';
import {IMessage} from '../quiz-lobby/quiz-lobby.component';
import {ISessionConfiguration} from '../../../../lib/session_configuration/interfaces';
import {DefaultSettings} from '../../../service/settings.service';
import {HttpClient} from '@angular/common/http';
import {ConnectionService} from '../../../service/connection.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {I18nService, NumberTypes} from '../../../service/i18n.service';
import {SessionConfiguration} from '../../../../lib/session_configuration/session_config';
import {MusicSessionConfiguration} from '../../../../lib/session_configuration/session_config_music';

export class Countdown {

  private _isRunning: boolean;
  private _time: number;
  private _remainingTime: number;

  public onChange = new EventEmitter<number>();

  constructor(question: IQuestion, startTimestamp: number) {
    this._time = question.timer;
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
  private _isActiveQuiz = false;
  private _isOwner: boolean;
  private _hashtag: string;

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private currentQuizService: CurrentQuizService,
    private http: HttpClient,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private i18nService: I18nService,
    private attendeeService: AttendeeService) {
    if (activeQuestionGroupService.activeQuestionGroup) {
      this._isOwner = true;
      this._hashtag = activeQuestionGroupService.activeQuestionGroup.hashtag;
      this.connectionService.authorizeWebSocketAsOwner(this._hashtag);
      this.footerBarService.replaceFooterElments([
        FooterBarComponent.footerElemBack,
        FooterBarComponent.footerElemReadingConfirmation,
        FooterBarComponent.footerElemConfidenceSlider,
        FooterBarComponent.footerElemResponseProgress,
        FooterBarComponent.footerElemFullscreen,
        FooterBarComponent.footerElemSound,
      ]);
      FooterBarComponent.footerElemBack.onClickCallback = () => {
        this.http.patch(`${DefaultSettings.httpApiEndpoint}/quiz/reset/${this._hashtag}`, {
        }).subscribe(
          (data: IMessage) => {
            this.router.navigate(['/quiz', 'flow', 'lobby']);
          }
        );
      };
    } else {
      this._isOwner = false;
      this._hashtag = currentQuizService.hashtag;
    }
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
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0'
    };
    if (questionIndex >= 0) {
      const matches = this.attendeeService.attendees.filter(value => {
        return value.responses[questionIndex] ? value.responses[questionIndex].confidence : false;
      });
      const absoluteValues = matches.length ? this.attendeeService.attendees.map(value => {
        return value.responses[questionIndex] ? value.responses[questionIndex].confidence : 0;
      }).reduce((currentValue, nextValue) => {
        return currentValue + nextValue;
      }) : 0;
      result.absolute = matches.length;
      result.percent = this.i18nService.formatNumber(absoluteValues / (matches.length || 1) / 100, NumberTypes.percent);
    }
    return result;
  }

  showReadingConfirmation(): boolean {
    return this._sessionConfig.readingConfirmationEnabled;
  }

  showResponseProgress(): boolean {
    return this._sessionConfig.showResponseProgress;
  }

  getReadingConfirmationData(questionIndex: number): Object {
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0'
    };
    if (questionIndex >= 0) {
      const matchCount = this.attendeeService.attendees.filter(value => {
        return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
      }).length;
      result.absolute = matchCount;
      result.percent = this.i18nService.formatNumber(matchCount / (this.attendeeService.attendees.length || 1), NumberTypes.percent);
    }
    return result;
  }

  handleMessages() {
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'MEMBER:UPDATED_RESPONSE':
          console.log('modify response data for nickname', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload.nickname);
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
      }
      this._isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage) {
    switch (data.step) {
      default:
        return;
    }
  }

  private handleMessagesForAttendee(data: IMessage) {
    switch (data.step) {
      case 'QUIZ:UPDATED_SETTINGS':
        this.currentQuizService.sessionConfiguration[data.payload.target] = data.payload.state;
        break;
    }
  }

  private sendDummyTestData(): void {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this._hashtag,
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

  private sendDummyTestData2(): void {
    this.http.put(`${DefaultSettings.httpApiEndpoint}/quiz/member/response`, {
      quizName: this._hashtag,
      nickname: 'testnickerina',
      questionIndex: this._currentQuestionIndex,
      value: 1,
      responseTime: 200,
      confidence: 40,
      readingConfirmation: true
    }).subscribe(
      (data: IMessage) => {
        console.log(data);
      }
    );
  }

  ngOnInit() {
    if (this._isOwner) {
      this._sessionConfig = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig;
      this._questions = this.activeQuestionGroupService.activeQuestionGroup.questionList;
      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/start`, {
        quizName: this._hashtag
      }).subscribe(
        (data: IMessage) => {
          console.log(data);
          if (data.status !== 'STATUS:SUCCESSFUL' && data.step !== 'QUIZ:ALREADY_STARTED') {
            return;
          }
          this._currentQuestionIndex = data.payload.nextQuestionIndex;
          this._countdown = new Countdown(this.questions[this._currentQuestionIndex], data.payload.startTimestamp);
          this._countdown.onChange.subscribe((value) => {
            this._countdownValue = value;
            if (value) {
              this._isActiveQuiz = !!value;
            }
          });
          if (data.status === 'STATUS:SUCCESSFUL') {
            setTimeout(() => {
              this.sendDummyTestData();
            }, 1500);
          }
        }
      );
    } else {
      this.connectionService.authorizeWebSocket(this._hashtag);
      this._questions = [this.currentQuizService.currentQuestion];
      console.log(this._questions);
      this._sessionConfig = new SessionConfiguration(this.currentQuizService.sessionConfiguration);
    }
    this.connectionService.initConnection().then(() => {
      this.handleMessages();
    });
  }

  ngOnDestroy() {
    FooterBarComponent.footerElemBack.restoreClickCallback();
  }

}
