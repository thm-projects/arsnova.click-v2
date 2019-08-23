import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { AbstractQuestionEntity } from '../../../../lib/entities/question/AbstractQuestionEntity';
import { NumberType, StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../../lib/enums/Message';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { QuizState } from '../../../../lib/enums/QuizState';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { ToLobbyConfirmComponent } from './modals/to-lobby-confirm/to-lobby-confirm.component';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
}) //
@AutoUnsubscribe('_subscriptions')
export class QuizResultsComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuizResultsComponent';
  public countdown: number;
  public answers: Array<string> = [];
  public showStartQuizButton: boolean;
  public showStopCountdownButton: boolean;
  public showStopQuizButton: boolean;
  public isStarting: boolean;
  public isStopping: boolean;
  public isLoadingQuestionData: boolean;

  private _hideProgressbarStyle = true;
  private readonly _messageSubscriptions: Array<string> = [];

  get hideProgressbarStyle(): boolean {
    return this._hideProgressbarStyle;
  }

  set hideProgressbarStyle(value: boolean) {
    this._hideProgressbarStyle = value;
    this.cd.markForCheck();
  }

  private _selectedQuestionIndex: number;

  get selectedQuestionIndex(): number {
    return this._selectedQuestionIndex;
  }

  private _questionText: string;

  get questionText(): string {
    return this._questionText;
  }

  private _serverUnavailableModal: NgbModalRef;
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
    private ngbModal: NgbModal,
    private cd: ChangeDetectorRef, private messageQueue: SimpleMQ,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuizResultsComponent.TYPE;

    headerLabelService.headerLabel = 'component.liveResults.title';
  }

  public showLeaderBoardButton(index: number): boolean {
    if (this.countdown > 0 || !this.quizService.quiz || typeof index === 'undefined' || index < 0 || index
        > this.quizService.quiz.questionList.length) {
      return;
    }
    if (index === this.quizService.quiz.currentQuestionIndex && //
        this.quizService.quiz.sessionConfig.readingConfirmationEnabled && //
        (this.quizService.readingConfirmationRequested || (this.countdown))) {
      return;
    }

    this.cd.markForCheck();
    return ![QuestionType.SurveyQuestion, QuestionType.ABCDSingleChoiceQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showQuestionButton(index: number): boolean {
    if (this.countdown > 0 || !this.quizService.quiz || typeof index === 'undefined' || index < 0 || index
        > this.quizService.quiz.questionList.length) {
      return;
    }
    if (index === this.quizService.quiz.currentQuestionIndex && //
        this.quizService.quiz.sessionConfig.readingConfirmationEnabled && //
        (this.quizService.readingConfirmationRequested || (this.countdown))) {
      return;
    }

    this.cd.markForCheck();
    return ![QuestionType.ABCDSingleChoiceQuestion].includes(this.quizService.quiz.questionList[index].TYPE);
  }

  public showConfidenceRate(questionIndex: number): boolean {
    this.cd.markForCheck();
    if (!environment.confidenceSliderEnabled || !this.quizService.quiz) {
      return;
    }

    const matches = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].confidence > -1 : false;
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
    this.cd.markForCheck();
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
    this.cd.markForCheck();
    return result;
  }

  public showReadingConfirmation(questionIndex: number): boolean {
    this.cd.markForCheck();
    if (!environment.readingConfirmationEnabled || !this.quizService.quiz) {
      return;
    }

    const matchCount = this.attendeeService.attendees.filter(value => {
      return value.responses[questionIndex] ? value.responses[questionIndex].readingConfirmation : false;
    }).length;
    const readingConfirmationStatus = this.quizService.quiz.sessionConfig.readingConfirmationEnabled;
    const isReadingConfirmationEnabled = typeof readingConfirmationStatus === 'undefined' ? false : readingConfirmationStatus;
    this.cd.markForCheck();
    return matchCount > 0 || isReadingConfirmationEnabled;
  }

  public showResponseProgress(): boolean {
    this.cd.markForCheck();
    const currentQuestion = this.quizService.currentQuestion();
    return (this.quizService.quiz && this.quizService.quiz.sessionConfig.showResponseProgress) || //
           (currentQuestion && currentQuestion.timer && this.countdown === 0);
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
    this.cd.markForCheck();
    return result;
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.questionTextService.eventEmitter.subscribe((value: string | Array<string>) => {
      if (Array.isArray(value)) {
        this.answers = value;
      } else {
        this._questionText = value;
      }
    }));

    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(async quiz => {
      if (!quiz) {
        return;
      }
      const storedSelectedQuestionIndex = parseInt(sessionStorage.getItem(StorageKey.CurrentQuestionIndex), 10);
      if (!isNaN(storedSelectedQuestionIndex)) {
        this.modifyVisibleQuestion(storedSelectedQuestionIndex);
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      } else {
        this.modifyVisibleQuestion(this.quizService.quiz.currentQuestionIndex);
      }

      await this.initData();

      this.addFooterElements();
      this.cd.markForCheck();
    }));

    this.isLoadingQuestionData = true;
    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.handleMessages();
      this.questionTextService.change(this.quizService.currentQuestion().questionText).then(() => this.cd.markForCheck());
    });

    this._subscriptions.push(this.connectionService.serverStatusEmitter.subscribe(isConnected => {
      if (isConnected) {
        if (this._serverUnavailableModal) {
          this._serverUnavailableModal.dismiss();
        }
        return;
      } else if (!isConnected && this._serverUnavailableModal) {
        return;
      }

      this.ngbModal.dismissAll();
      this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent, {
        keyboard: false,
        backdrop: 'static',
      });
      this._serverUnavailableModal.result.finally(() => this._serverUnavailableModal = null);
    }));
  }

  public ngOnDestroy(): void {
    sessionStorage.setItem(StorageKey.CurrentQuestionIndex, String(this._selectedQuestionIndex));
    this.footerBarService.footerElemBack.restoreClickCallback();
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
  }

  public stopQuiz(): void {
    this.isStopping = true;
    this.quizApiService.stopQuiz(this.quizService.quiz).subscribe(data => {
      if (data.status !== StatusProtocol.Success) {
        console.log('QuizResultsComponent: StopQuiz failed', data);
      }
    });
    if (this.countdown) {
      this.countdown = 0;
    }
    this.cd.markForCheck();
    this.isStopping = false;
  }

  public async startQuiz(): Promise<void> {
    this.isStarting = true;
    this.hideProgressbarStyle = true;
    const startQuizData = await this.quizApiService.nextStep(this.quizService.quiz.name).toPromise();
    if (startQuizData.status !== StatusProtocol.Success) {
      console.log('QuizResultsComponent: NextStep failed', startQuizData);
      this.isStarting = false;
      return;
    }

    const question = this.quizService.currentQuestion();
    this.generateAnswers(question);
    this.questionTextService.change(this.quizService.currentQuestion().questionText).then(() => this.cd.markForCheck());

    if (environment.readingConfirmationEnabled && startQuizData.step === MessageProtocol.ReadingConfirmationRequested) {
      this.quizService.readingConfirmationRequested = true;
      return;
    }

    this.quizService.readingConfirmationRequested = false;

    if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
      this.footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack, this.footerBarService.footerElemLeaderboard,
      ]);
    }

    this.cd.markForCheck();
    this.isStarting = false;
  }

  private initData(): Promise<void> {

    return this.quizApiService.getQuizStatus(this.quizService.quiz.name).toPromise().then(currentStateData => {
      if (currentStateData.status !== StatusProtocol.Success) {
        this.router.navigate(['/']);
        return;
      }

      if (currentStateData.payload.state === QuizState.Active) {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
        return;
      }

      const question = this.quizService.currentQuestion();

      if (!this.countdown) {
        this.countdown = 0;
        if (question.timer === 0 && !currentStateData.payload.readingConfirmationRequested && this.attendeeService.attendees.some(
          nick => nick.responses[this.quizService.quiz.currentQuestionIndex].responseTime === -1)) {
          this.showStartQuizButton = false;
          this.hideProgressbarStyle = false;
          this.showStopQuizButton = this.quizService.isOwner;
        } else {
          this.showStartQuizButton = this.quizService.isOwner && //
                                     this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
          this.hideProgressbarStyle = false;
        }

      } else {
        if (this.attendeeService.attendees.every(nick => {
          const val = nick.responses[this.quizService.quiz.currentQuestionIndex].value;
          return typeof val === 'number' ? val > -1 : val.length > 0;
        })) {
          console.log('QuizResultsComponent: Stopping countdown since all attendees have answered the current question');
          this.countdown = 0;
          this.hideProgressbarStyle = false;
          this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length
                                     > this.quizService.quiz.currentQuestionIndex + 1;

        } else if (currentStateData.payload.readingConfirmationRequested) {
          console.log('QuizResultsComponent: Stopping countdown since reading confirmation is requested');
          this.countdown = 0;
          this.hideProgressbarStyle = false;
          this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length
                                     > this.quizService.quiz.currentQuestionIndex + 1;
        } else {
          console.log('QuizResultsComponent: Countdown is proceeding');
          this.hideProgressbarStyle = currentStateData.payload.startTimestamp > -1;
        }
      }

      this.cd.markForCheck();
      this.isLoadingQuestionData = false;
    });
  }

  private addFooterElements(): void {

    let footerElems;

    if (this.quizService.isOwner) {
      footerElems = [
        this.footerBarService.footerElemBack,
      ];
      if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1) {
        if (this.quizService.quiz.questionList.every(
          question => [QuestionType.ABCDSingleChoiceQuestion, QuestionType.SurveyQuestion].includes(question.TYPE))) {
          footerElems.push(this.footerBarService.footerElemExport);
        } else {
          footerElems.push(this.footerBarService.footerElemLeaderboard);
        }
      } else {
        if (environment.readingConfirmationEnabled) {
          footerElems.splice(2, 0, this.footerBarService.footerElemReadingConfirmation);
        }
        if (environment.confidenceSliderEnabled) {
          footerElems.push(this.footerBarService.footerElemConfidenceSlider);
        }
      }
      this.footerBarService.footerElemBack.onClickCallback = async () => {
        this.ngbModal.open(ToLobbyConfirmComponent).result.then(() => {
          this.quizApiService.resetQuiz(this.quizService.quiz).subscribe(() => {
            this.quizService.quiz.currentQuestionIndex = -1;
          });
        }).catch(() => {});
      };
    } else {
      footerElems = [];
      if (this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1 && this.quizService.quiz.questionList.some(
        question => [
          QuestionType.FreeTextQuestion,
          QuestionType.MultipleChoiceQuestion,
          QuestionType.RangedQuestion,
          QuestionType.SingleChoiceQuestion,
          QuestionType.TrueFalseSingleChoiceQuestion,
          QuestionType.YesNoSingleChoiceQuestion,
        ].includes(question.TYPE))) {
        footerElems.push(this.footerBarService.footerElemLeaderboard);
      }
    }
    this.footerBarService.replaceFooterElements(footerElems);
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.AllPlayers, payload => {
        payload.members.forEach((elem: IMemberSerialized) => {
          this.attendeeService.addMember(elem);
        });
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this.countdown = payload.value;
        this.hideProgressbarStyle = this.countdown > 0;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        this.attendeeService.removeMember(payload.name);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        this.attendeeService.modifyResponse(payload);
        console.log('QuizResultsComponent: modify response data for nickname', payload.nickname);
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        this._selectedQuestionIndex = payload.nextQuestionIndex;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.quizService.quiz.currentStartTimestamp = payload.currentStartTimestamp;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.countdown = 0;
        this.hideProgressbarStyle = false;
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.router.navigate(['/']);
      }),
    ]);

    this.quizService.isOwner ? this.handleMessagesForOwner() : this.handleMessagesForAttendee();
  }

  private handleMessagesForOwner(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.showStartQuizButton = false;
        this.showStopQuizButton = this.quizService.currentQuestion().timer === 0;
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.showStopCountdownButton = false;
        this.showStopQuizButton = false;
        this.showStartQuizButton = this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this.showStopCountdownButton = payload.value > 0;
        this.showStartQuizButton = !payload.value && this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex + 1;
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        this.showStartQuizButton = this.quizService.isOwner && this.quizService.quiz.questionList.length > this.quizService.quiz.currentQuestionIndex
                                   + 1;
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        this.showStartQuizButton = true;
        this.showStopQuizButton = false;
      }),
    ]);
  }

  private handleMessagesForAttendee(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        if (environment.readingConfirmationEnabled) {
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        } else {
          this.router.navigate(['/quiz', 'flow', 'voting']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === payload.name) {
          this.router.navigate(['/']);
        }
      }),
    ]);
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
