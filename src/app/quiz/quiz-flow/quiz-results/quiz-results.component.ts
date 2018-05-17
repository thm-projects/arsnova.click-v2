import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {IQuestion} from 'arsnova-click-v2-types/src/questions/interfaces';
import {AttendeeService} from '../../../service/attendee.service';
import {IMessage, INickname} from 'arsnova-click-v2-types/src/common';
import {DefaultSettings} from '../../../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {ConnectionService} from '../../../service/connection.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {Router} from '@angular/router';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {I18nService, NumberTypes} from '../../../service/i18n.service';
import {QuestionTextService} from '../../../service/question-text.service';
import {RangedQuestion} from 'arsnova-click-v2-types/src/questions/question_ranged';
import {FreeTextQuestion} from 'arsnova-click-v2-types/src/questions/question_freetext';
import {SurveyQuestion} from 'arsnova-click-v2-types/src/questions/question_survey';

export class Countdown {
  get isRunning(): boolean {
    return this._isRunning;
  }
  get remainingTime(): number {
    return this._remainingTime;
  }
  set remainingTime(value: number) {
    this._remainingTime = value;
  }

  private _isRunning: boolean;
  private readonly _time: number;
  private _remainingTime: number;
  private readonly _interval: any;

  public onChange = new EventEmitter<number>();

  constructor(question: IQuestion, startTimestamp: number) {
    this._time = question.timer;
    const endTimestamp = startTimestamp + this._time * 1000;
    this._remainingTime = Math.round((endTimestamp - new Date().getTime()) / 1000);
    if (this._remainingTime <= 0) {
      return;
    }
    this._isRunning = true;
    this._interval = setInterval(() => {
      this._remainingTime--;
      this.onChange.next(this._remainingTime);
      if (this._remainingTime <= 0) {
        this._isRunning = false;
        clearInterval(this._interval);
      }
    }, 1000);
  }

  public stop() {
    clearInterval(this._interval);
    this._remainingTime = 0;
    this._isRunning = false;
  }
}

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizResultsComponent';

  get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }
  private _selectedQuestionIndex: number;

  public countdown: Countdown;
  public answers: Array<string> = [];

  constructor(
    public currentQuizService: CurrentQuizService,
    public attendeeService: AttendeeService,
    public i18nService: I18nService,
    private http: HttpClient,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private questionTextService: QuestionTextService
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizResultsComponent.TYPE;

    headerLabelService.headerLabel = 'component.liveResults.title';

    this._selectedQuestionIndex = currentQuizService.questionIndex;
    let footerElems;

    if (currentQuizService.isOwner) {
      this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
        footerElems = [
          this.footerBarService.footerElemBack,
          this.footerBarService.footerElemLeaderboard,
          this.footerBarService.footerElemFullscreen,
        ];
      } else {
        footerElems = [
          this.footerBarService.footerElemBack,
          this.footerBarService.footerElemReadingConfirmation,
          this.footerBarService.footerElemConfidenceSlider,
          this.footerBarService.footerElemResponseProgress,
          this.footerBarService.footerElemFullscreen,
          this.footerBarService.footerElemSound,
        ];
      }
      this.footerBarService.footerElemBack.onClickCallback = () => {
        this.http.patch(`${DefaultSettings.httpApiEndpoint}/quiz/reset/${this.currentQuizService.quiz.hashtag}`, {}).subscribe(
          (data: IMessage) => {
            this.currentQuizService.questionIndex = 0;
            this.router.navigate(['/quiz', 'flow', 'lobby']);
          }
        );
      };
    } else {
      if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
        footerElems = [
          this.footerBarService.footerElemLeaderboard,
          this.footerBarService.footerElemFullscreen,
        ];
      } else {
        footerElems = [
          this.footerBarService.footerElemFullscreen
        ];
      }
    }
    this.footerBarService.replaceFooterElements(footerElems);
  }

  showLeaderBoardButton(index: number): boolean {
    return !(this.currentQuizService.quiz.questionList[index] instanceof SurveyQuestion);
  }

  showStopQuizButton(): boolean {
    return this.currentQuizService.isOwner
      && !this.currentQuizService.currentQuestion().timer
      &&
      (
        this.attendeeService.attendees.length > this.attendeeService.attendees.filter(nick => {
          return nick.responses[this.currentQuizService.questionIndex];
        }).length
      );
  }

  showStopCountdownButton(): boolean {
    return this.currentQuizService.isOwner
      &&
      (
        this.attendeeService.attendees.length > this.attendeeService.attendees.filter(nick => {
          return nick.responses[this.currentQuizService.questionIndex];
        }).length
      ) &&
      (
        this.countdown &&
        this.countdown.isRunning &&
        this.countdown.remainingTime > 0
      );
  }

  showStartQuizButton(): boolean {
    return this.currentQuizService.isOwner &&
      !this.showStopCountdownButton() &&
      !this.showStopQuizButton() &&
      this.currentQuizService.questionIndex === this._selectedQuestionIndex &&
      (
        this.currentQuizService.questionIndex < this.currentQuizService.quiz.questionList.length - 1 ||
        this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled &&
        this.currentQuizService.readingConfirmationRequested
      );
  }

  hideProgressbarCssStyle(): boolean {
    const resultLength = this.attendeeService.attendees.filter(nick => {
      const responses = nick.responses[this._selectedQuestionIndex];
      if (responses) {
        if (typeof responses.value === 'number') {
          return responses.value > 0;
        }
        return responses.value.length > 0;
      }
    }).length;

    return (
      this._selectedQuestionIndex <= this.currentQuizService.questionIndex &&
      !resultLength &&
      !this.currentQuizService.readingConfirmationRequested
    );
  }

  showConfidenceRate(questionIndex: number): boolean {
    const matches = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence : false;
    });
    const hasConfidenceSet = typeof this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled !== 'undefined';
    const isConfidenceEnabled = typeof hasConfidenceSet ?
      this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled :
      false;
    return hasConfidenceSet ? matches.length > 0 || isConfidenceEnabled : matches.length > 0;
  }

  modifyVisibleQuestion(index: number): void {
    this._selectedQuestionIndex = index;
    this.generateAnswers(this.currentQuizService.quiz.questionList[index]);
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

  showReadingConfirmation(questionIndex: number): boolean {
    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    const isReadingConfirmationEnabled = typeof this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled === 'undefined' ?
      false : this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled;
    return matchCount > 0 || isReadingConfirmationEnabled;
  }

  showResponseProgress(): boolean {
    return this.currentQuizService.quiz.sessionConfig.showResponseProgress;
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
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: 'STATUS:SUCCESSFUL',
        step: 'LOBBY:GET_PLAYERS',
        payload: {quizName: this.currentQuizService.quiz.hashtag}
      });
    }
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          this.attendeeService.modifyResponse(data.payload.nickname);
          if (this.attendeeService.attendees.filter(attendee => {
              return attendee.responses[this.currentQuizService.questionIndex] ?
                     attendee.responses[this.currentQuizService.questionIndex].value :
                     false;
          }).length === this.attendeeService.attendees.length && this.countdown) {
            this.countdown.stop();
          }
          break;
        case 'QUIZ:NEXT_QUESTION':
          this.currentQuizService.questionIndex = data.payload.questionIndex;
          this._selectedQuestionIndex = data.payload.questionIndex;
          break;
        case 'QUIZ:RESET':
          this.attendeeService.clearResponses();
          this.currentQuizService.questionIndex = 0;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
      }
      this.currentQuizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
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
      case 'QUIZ:START':
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case 'QUIZ:READING_CONFIRMATION_REQUESTED':
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case 'LOBBY:CLOSED':
        this.router.navigate(['/']);
        break;
      case 'QUIZ:STOP':
        this.countdown.stop();
        break;
    }
  }

  private startQuiz(): void {
    const target = this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled &&
                   !this.currentQuizService.readingConfirmationRequested ?
                   'reading-confirmation' : 'start';

    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/${target}`, {
      quizName: this.currentQuizService.quiz.hashtag
    }).subscribe((data: IMessage) => {

      if (data.status === 'STATUS:SUCCESSFUL') {
        const question = this.currentQuizService.currentQuestion();
        this.generateAnswers(question);

        if (data.step === 'QUIZ:READING_CONFIRMATION_REQUESTED') {
          this.currentQuizService.readingConfirmationRequested = true;

        } else {
          this.currentQuizService.readingConfirmationRequested = false;

          if (question.timer) {
            this.countdown = new Countdown(question, data.payload.startTimestamp);
          }

          if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
            this.footerBarService.replaceFooterElements([
              this.footerBarService.footerElemBack,
              this.footerBarService.footerElemLeaderboard,
              this.footerBarService.footerElemFullscreen,
            ]);
          }

        }
      }
    });
  }

  private stopQuiz(): void {
    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/stop`, {
      quizName: this.currentQuizService.quiz.hashtag
    }).subscribe((data: IMessage) => {
      if (data.status !== 'STATUS:SUCCESSFUL') {
        console.log(data);
      }
      this.countdown.stop();
    });
  }

  private generateAnswers(question: IQuestion): void {
    if (question instanceof RangedQuestion) {
      this.answers = ['guessed_correct', 'guessed_in_range', 'guessed_wrong'];

    } else if (question instanceof FreeTextQuestion) {
      this.answers = ['correct_answer', 'wrong_answer'];

    } else {
      this.questionTextService.changeMultiple(question.answerOptionList.map(answer => {
        return answer.answerText;
      }));
    }
  }

  ngOnInit() {
    this.questionTextService.getEmitter().subscribe((data: Array<string>) => {
      this.answers = data;
    });
    this.connectionService.initConnection().then(() => {
      const url = `${DefaultSettings.httpApiEndpoint}/quiz/currentState/${this.currentQuizService.quiz.hashtag}`;
      this.http.get(url).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL') {
          const question = this.currentQuizService.currentQuestion();

          if (question.timer && new Date().getTime() - data.payload.startTimestamp < 0) {
            this.countdown = new Countdown(question, data.payload.startTimestamp);
          }

          this.generateAnswers(question);
        }
      });
      if (this.currentQuizService.isOwner) {
        this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      } else {
        this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      }
      this.handleMessages();
      if (this.attendeeService.attendees.filter(attendee => {
          return attendee.responses[this.currentQuizService.questionIndex];
        }).length === this.attendeeService.attendees.length && this.countdown) {
        this.countdown.stop();
      }
    });
  }

  ngOnDestroy() {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

}
