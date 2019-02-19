import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { Countdown } from '../../../../lib/countdown/countdown';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { NumberType, StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../../lib/enums/Message';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { QuizState } from '../../../../lib/enums/QuizState';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuizResultsComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizResultsComponent';
  public countdown: Countdown;
  public answers: Array<string> = [];

  private _selectedQuestionIndex: number;

  get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    public quizService: QuizService,
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

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._selectedQuestionIndex = quizService.quiz.currentQuestionIndex;
      this.attendeeService.restoreMembers().then(() => {
        this.initData();
      });
      this.addFooterElements();
    }));
  }

  public showLeaderBoardButton(index: number): boolean {
    if (!this.quizService.quiz || typeof index === 'undefined' || index < 0 || index > this.quizService.quiz.questionList.length) {
      return;
    }

    return ![QuestionType.SurveyQuestion, QuestionType.ABCDSingleChoiceQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showQuestionButton(index: number): boolean {
    if (!this.quizService.quiz || typeof index === 'undefined' || index < 0 || index > this.quizService.quiz.questionList.length) {
      return;
    }

    return ![QuestionType.ABCDSingleChoiceQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showStopQuizButton(): boolean {
    return this.quizService.isOwner && //
           !this.quizService.currentQuestion().timer && //
           this.attendeeService.attendees.some(nick => {
             const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
             return typeof val === 'number' ? val > -1 : val.length === 0;
           });
  }

  public showStopCountdownButton(): boolean {
    return this.quizService.isOwner && //
           this.attendeeService.attendees.some(nick => {
             const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
             return typeof val === 'number' ? val > -1 : val.length === 0;
           }) && //
           this.countdown && //
           this.countdown.isRunning && //
           this.countdown.remainingTime > 0;
  }

  public showStartQuizButton(): boolean {
    return this.quizService.isOwner && //
           !this.showStopCountdownButton() && //
           !this.showStopQuizButton() && //
           this.quizService.quiz.currentQuestionIndex === this._selectedQuestionIndex && //
           ( //
             this.quizService.quiz && //
             this.quizService.quiz.currentQuestionIndex < this.quizService.quiz.questionList.length - 1 || //
             (this.quizService.quiz.sessionConfig.readingConfirmationEnabled && //
              this.quizService.readingConfirmationRequested) //
           );
  }

  public hideProgressbarCssStyle(): boolean {
    return this._selectedQuestionIndex === this.quizService.quiz.currentQuestionIndex && this.countdown && this.countdown.remainingTime > 0;
  }

  public showConfidenceRate(questionIndex: number): boolean {
    if (!this.quizService.quiz) {
      return;
    }

    const matches = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence : false;
    });
    const hasConfidenceSet = typeof this.quizService.quiz.sessionConfig.confidenceSliderEnabled !== 'undefined';
    const isConfidenceEnabled = typeof hasConfidenceSet ? this.quizService.quiz.sessionConfig.confidenceSliderEnabled : false;
    return hasConfidenceSet ? matches.length > 0 || isConfidenceEnabled : matches.length > 0;
  }

  public modifyVisibleQuestion(index: number): void {
    if (!this.quizService.quiz) {
      return;
    }

    this._selectedQuestionIndex = index;
    this.generateAnswers(this.quizService.quiz.questionList[index]);
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
      result.percent = this.i18nService.formatNumber(absoluteValues / (matches.length || 1) / 100, NumberType.Percent);
    }
    return result;
  }

  public showReadingConfirmation(questionIndex: number): boolean {
    if (!this.quizService.quiz) {
      return;
    }

    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    const readingConfirmationStatus = this.quizService.quiz.sessionConfig.readingConfirmationEnabled;
    const isReadingConfirmationEnabled = typeof readingConfirmationStatus === 'undefined' ? false : readingConfirmationStatus;
    return matchCount > 0 || isReadingConfirmationEnabled;
  }

  public showResponseProgress(): boolean {
    return this.quizService.quiz && this.quizService.quiz.sessionConfig.showResponseProgress;
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
      result.percent = this.i18nService.formatNumber(matchCount / (this.attendeeService.attendees.length || 1), NumberType.Percent);
    }
    return result;
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.questionTextService.eventEmitter.subscribe((data: Array<string>) => {
      this.answers = data;
    }));
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public stopQuiz(): void {
    this.quizApiService.stopQuiz(this.quizService.quiz).subscribe(data => {
      if (data.status !== StatusProtocol.Success) {
        console.log(data);
      }
    });
    if (this.countdown) {
      this.countdown.stop();
    }
  }

  public async startQuiz(): Promise<void> {
    const startQuizData = await this.quizApiService.nextStep().toPromise();
    if (startQuizData.status !== StatusProtocol.Success) {
      console.log(startQuizData);
      return;
    }

    const question = this.quizService.currentQuestion();
    this.generateAnswers(question);

    if (startQuizData.step === MessageProtocol.ReadingConfirmationRequested) {
      this.quizService.readingConfirmationRequested = true;
      return;
    }

    this.quizService.readingConfirmationRequested = false;

    if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack, this.footerBarService.footerElemLeaderboard, this.footerBarService.footerElemFullscreen,
      ]);
    }
  }

  private initData(): void {

    this.connectionService.initConnection().then(() => {
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });

    this.quizApiService.getQuizStatus(this.quizService.quiz.name).toPromise().then(currentStateData => {
      if (currentStateData.status !== StatusProtocol.Success) {
        this.router.navigate(['/']);
      }
      if (currentStateData.payload.state === QuizState.Active) {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }
      const question = this.quizService.currentQuestion();

      if (question.timer && (new Date().getTime() - question.timer * 1000 - currentStateData.payload.startTimestamp) < 0) {
        this.countdown = new Countdown(question, currentStateData.payload.startTimestamp);
      }

      this.generateAnswers(question);
      if (this.attendeeService.attendees.every(nick => {
        const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
        return typeof val === 'number' ? val > -1 : val.length > 0;
      }) && this.countdown) {
        console.log('Stopping countdown in the quiz results since all attendees have answered the current question');
        this.countdown.stop();
      } else if (currentStateData.payload.readingConfirmationRequested && this.countdown) {
        console.log('Stopping countdown since reading confirmation is requested');
        this.countdown.stop();
      } else {
        console.log(this.attendeeService.attendees, this.attendeeService.attendees.every(nick => {
          const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
          console.log('checking response of nick', nick, val);
          return typeof val === 'number' ? val > -1 : val.length > 0;
        }));
      }
    });
  }

  private addFooterElements(): void {

    let footerElems;

    if (this.quizService.isOwner) {
      footerElems = [
        this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen,
      ];
      if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
        if (this.quizService.quiz.questionList.every(
          question => [QuestionType.ABCDSingleChoiceQuestion, QuestionType.SurveyQuestion].includes(question.TYPE))) {
          footerElems.push(this.footerBarService.footerElemExport);
        } else {
          footerElems.push(this.footerBarService.footerElemLeaderboard);
        }
      } else {
        footerElems.push(...[
          this.footerBarService.footerElemReadingConfirmation,
          this.footerBarService.footerElemConfidenceSlider,
          this.footerBarService.footerElemResponseProgress,
        ]);
      }
      this.footerBarService.footerElemBack.onClickCallback = async () => {
        await this.quizApiService.resetQuiz(this.quizService.quiz).toPromise();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      };
    } else {
      footerElems = [
        this.footerBarService.footerElemFullscreen,
      ];
      if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
        if (this.quizService.quiz.questionList.every(
          question => [QuestionType.ABCDSingleChoiceQuestion, QuestionType.SurveyQuestion].includes(question.TYPE))) {
          footerElems.push(this.footerBarService.footerElemExport);
        } else {
          footerElems.push(this.footerBarService.footerElemLeaderboard);
        }
      }
    }
    this.footerBarService.replaceFooterElements(footerElems);
  }

  private handleMessages(): void {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: StatusProtocol.Success,
        step: MessageProtocol.GetPlayers,
        payload: { quizName: this.quizService.quiz.name },
      });
    }
    this.connectionService.dataEmitter.subscribe(async (data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.AllPlayers:
          data.payload.members.forEach((elem: IMemberSerialized) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case MessageProtocol.Added:
          this.attendeeService.addMember(data.payload.member);
          break;
        case MessageProtocol.Removed:
          this.attendeeService.removeMember(data.payload.name);
          break;
        case MessageProtocol.UpdatedResponse:
          this.attendeeService.modifyResponse(data.payload);
          if (this.attendeeService.attendees.every(nick => {
            const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
            return typeof val === 'number' ? val > -1 : val.length > 0;
          }) && this.countdown) {
            this.countdown.stop();
          }
          break;
        case MessageProtocol.NextQuestion:
          this.quizService.quiz.currentQuestionIndex = data.payload.nextQuestionIndex;
          this._selectedQuestionIndex = data.payload.nextQuestionIndex;
          break;
        case MessageProtocol.Start:
          this.quizService.quiz.currentStartTimestamp = data.payload.currentStartTimestamp;
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
      }
      this.quizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage): void {
    switch (data.step) {
      case MessageProtocol.Start:
        this.countdown = new Countdown(this.quizService.currentQuestion(), this.quizService.quiz.currentStartTimestamp);
        break;
      default:
        return;
    }
  }

  private handleMessagesForAttendee(data: IMessage): void {
    switch (data.step) {
      case MessageProtocol.Start:
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case MessageProtocol.ReadingConfirmationRequested:
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case MessageProtocol.Closed:
        this.router.navigate(['/']);
        break;
      case MessageProtocol.Stop:
        if (this.countdown) {
          this.countdown.stop();
        }
        break;
      case MessageProtocol.Removed:
        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === data.payload.name) {
          this.router.navigate(['/']);
        }
        break;
    }
  }

  private generateAnswers(question: AbstractQuestionEntity): void {
    if (question.TYPE === QuestionType.RangedQuestion) {
      this.answers = ['component.liveResults.guessed_correct', 'component.liveResults.guessed_in_range', 'component.liveResults.guessed_wrong'];

    } else if (question.TYPE === QuestionType.FreeTextQuestion) {
      this.answers = ['component.liveResults.correct_answer', 'component.liveResults.wrong_answer'];

    } else {
      this.questionTextService.changeMultiple(question.answerOptionList.map(answer => {
        return answer.answerText;
      }));
    }
  }

}
