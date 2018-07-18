import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage, INickname } from 'arsnova-click-v2-types/src/common';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { FreeTextQuestion } from 'arsnova-click-v2-types/src/questions/question_freetext';
import { RangedQuestion } from 'arsnova-click-v2-types/src/questions/question_ranged';
import { SurveyQuestion } from 'arsnova-click-v2-types/src/questions/question_survey';
import { Countdown } from '../../../../lib/countdown/countdown';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { NUMBER_TYPE } from '../../../shared/enums';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
})
export class QuizResultsComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizResultsComponent';
  public countdown: Countdown;
  public answers: Array<string> = [];

  private _selectedQuestionIndex: number;

  get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }

  private _ownsQuiz: boolean;

  get ownsQuiz(): boolean {
    return this._ownsQuiz;
  }

  constructor(
    public currentQuizService: CurrentQuizService,
    public attendeeService: AttendeeService,
    private i18nService: I18nService,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private questionTextService: QuestionTextService,
    private quizApiService: QuizApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizResultsComponent.TYPE;

    headerLabelService.headerLabel = 'component.liveResults.title';

    this._selectedQuestionIndex = currentQuizService.questionIndex;

    this.currentQuizService.isOwner.subscribe(val => {
      this._ownsQuiz = !!val;
      this.addFooterElements();
    });
  }

  public showLeaderBoardButton(index: number): boolean {
    return !(
      this.currentQuizService.quiz.questionList[index] instanceof SurveyQuestion
    );
  }

  public showStopQuizButton(): boolean {
    return this.ownsQuiz && !this.currentQuizService.currentQuestion().timer && (
      this.attendeeService.attendees.length > this.attendeeService.attendees.filter(nick => {
        return nick.responses[this.currentQuizService.questionIndex];
      }).length
    );
  }

  public showStopCountdownButton(): boolean {
    return this.ownsQuiz && (
      this.attendeeService.attendees.length > this.attendeeService.attendees.filter(nick => {
        return nick.responses[this.currentQuizService.questionIndex];
      }).length
    ) && (
           this.countdown && this.countdown.isRunning && this.countdown.remainingTime > 0
           );
  }

  public showStartQuizButton(): boolean {
    return this.ownsQuiz && !this.showStopCountdownButton() && !this.showStopQuizButton() && this.currentQuizService.questionIndex
           === this._selectedQuestionIndex && (
             this.currentQuizService.questionIndex < this.currentQuizService.quiz.questionList.length - 1
             || this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled && this.currentQuizService.readingConfirmationRequested
           );
  }

  public hideProgressbarCssStyle(): boolean {
    const resultLength = this.attendeeService.attendees.filter(nick => {
      const responses = nick.responses[this._selectedQuestionIndex];
      if (responses) {
        if (typeof responses.value === 'number') {
          return responses.value > 0;
        }
        return responses.value.length > 0;
      }
      return false;
    }).length;

    return (
      this._selectedQuestionIndex <= this.currentQuizService.questionIndex && !resultLength && !this.currentQuizService.readingConfirmationRequested
    );
  }

  public showConfidenceRate(questionIndex: number): boolean {
    const matches = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence : false;
    });
    const hasConfidenceSet = typeof this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled !== 'undefined';
    const isConfidenceEnabled = typeof hasConfidenceSet ? this.currentQuizService.quiz.sessionConfig.confidenceSliderEnabled : false;
    return hasConfidenceSet ? matches.length > 0 || isConfidenceEnabled : matches.length > 0;
  }

  public async modifyVisibleQuestion(index: number): Promise<void> {
    this._selectedQuestionIndex = index;
    await this.generateAnswers(this.currentQuizService.quiz.questionList[index]);
  }

  public getConfidenceData(questionIndex: number): { base: number, absolute: number, percent: string } {
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0',
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
      result.percent = this.i18nService.formatNumber(absoluteValues / (
        matches.length || 1
      ) / 100, NUMBER_TYPE.PERCENT);
    }
    return result;
  }

  public showReadingConfirmation(questionIndex: number): boolean {
    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    const readingConfirmationStatus = this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled;
    const isReadingConfirmationEnabled = typeof readingConfirmationStatus === 'undefined' ? false : readingConfirmationStatus;
    return matchCount > 0 || isReadingConfirmationEnabled;
  }

  public showResponseProgress(): boolean {
    return this.currentQuizService.quiz.sessionConfig.showResponseProgress;
  }

  public getReadingConfirmationData(questionIndex: number): { base: number, absolute: number, percent: string } {
    const result = {
      base: this.attendeeService.attendees.length,
      absolute: 0,
      percent: '0',
    };
    if (questionIndex >= 0) {
      const matchCount = this.attendeeService.attendees.filter(value => {
        return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
      }).length;
      result.absolute = matchCount;
      result.percent = this.i18nService.formatNumber(matchCount / (
        this.attendeeService.attendees.length || 1
      ), NUMBER_TYPE.PERCENT);
    }
    return result;
  }

  public ngOnInit(): void {
    this.questionTextService.eventEmitter.subscribe((data: Array<string>) => {
      this.answers = data;
    });

    this.connectionService.initConnection().then(() => {

      if (this.ownsQuiz) {
        this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      } else {
        this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      }
      this.handleMessages();

      this.quizApiService.getCurrentQuizState(this.currentQuizService.quiz.hashtag).toPromise().then(currentStateData => {
        if (currentStateData.status === 'STATUS:SUCCESSFUL') {
          const question = this.currentQuizService.currentQuestion();

          if (question.timer && new Date().getTime() - currentStateData.payload.startTimestamp < 0) {
            this.countdown = new Countdown(question, currentStateData.payload.startTimestamp);
          }

          this.generateAnswers(question);
        }
        if (this.attendeeService.attendees.filter(attendee => {
          return attendee.responses[this.currentQuizService.questionIndex];
        }).length === this.attendeeService.attendees.length && this.countdown) {
          this.countdown.stop();
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
  }

  public stopQuiz(): void {
    this.quizApiService.postQuizStop({
      quizName: this.currentQuizService.quiz.hashtag,
    }).subscribe(data => {
      if (data.status !== 'STATUS:SUCCESSFUL') {
        console.log(data);
      }
    });
    this.countdown.stop();
  }

  private addFooterElements(): void {

    let footerElems;

    if (this.ownsQuiz) {
      this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
        footerElems = [
          this.footerBarService.footerElemBack, this.footerBarService.footerElemLeaderboard, this.footerBarService.footerElemFullscreen,
        ];
      } else {
        footerElems = [
          this.footerBarService.footerElemBack,
          this.footerBarService.footerElemReadingConfirmation,
          this.footerBarService.footerElemConfidenceSlider,
          this.footerBarService.footerElemResponseProgress,
          this.footerBarService.footerElemFullscreen,
        ];
      }
      this.footerBarService.footerElemBack.onClickCallback = async () => {
        await this.quizApiService.patchQuizReset(this.currentQuizService.quiz.hashtag).toPromise();
        this.currentQuizService.questionIndex = 0;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      };
    } else {
      if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
        footerElems = [
          this.footerBarService.footerElemLeaderboard, this.footerBarService.footerElemFullscreen,
        ];
      } else {
        footerElems = [
          this.footerBarService.footerElemFullscreen,
        ];
      }
    }
    this.footerBarService.replaceFooterElements(footerElems);
  }

  private handleMessages(): void {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: 'STATUS:SUCCESSFUL',
        step: 'LOBBY:GET_PLAYERS',
        payload: { quizName: this.currentQuizService.quiz.hashtag },
      });
    }
    this.connectionService.socket.subscribe(async (data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case 'MEMBER:UPDATED_RESPONSE':
          this.attendeeService.modifyResponse(data.payload.nickname);
          if (this.attendeeService.attendees.filter(attendee => {
            return attendee.responses[this.currentQuizService.questionIndex] ? attendee.responses[this.currentQuizService.questionIndex].value : false;
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
      this.ownsQuiz ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage): void {
    switch (data.step) {
      default:
        return;
    }
  }

  private handleMessagesForAttendee(data: IMessage): void {
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

  private async startQuiz(): Promise<void> {
    const target = this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled && !this.currentQuizService.readingConfirmationRequested
                   ? 'reading-confirmation' : 'start';

    const startQuizData = await this.quizApiService.postQuizData(target, {
      quizName: this.currentQuizService.quiz.hashtag,
    }).toPromise();
    if (startQuizData.status !== 'STATUS:SUCCESSFUL') {
      console.log(startQuizData);
      return;
    }

    const question = this.currentQuizService.currentQuestion();
    await this.generateAnswers(question);

    if (startQuizData.step === 'QUIZ:READING_CONFIRMATION_REQUESTED') {
      this.currentQuizService.readingConfirmationRequested = true;
      return;
    }

    this.currentQuizService.readingConfirmationRequested = false;

    if (question.timer) {
      this.countdown = new Countdown(question, startQuizData.payload.startTimestamp);
    }

    if (this.currentQuizService.questionIndex === this.currentQuizService.quiz.questionList.length - 1) {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack, this.footerBarService.footerElemLeaderboard, this.footerBarService.footerElemFullscreen,
      ]);
    }
  }

  private async generateAnswers(question: IQuestion): Promise<void> {
    if (question instanceof RangedQuestion) {
      this.answers = ['guessed_correct', 'guessed_in_range', 'guessed_wrong'];

    } else if (question instanceof FreeTextQuestion) {
      this.answers = ['correct_answer', 'wrong_answer'];

    } else {
      await this.questionTextService.changeMultiple(question.answerOptionList.map(answer => {
        return answer.answerText;
      }));
    }
  }

}
