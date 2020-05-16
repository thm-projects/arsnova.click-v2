import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { SurveyQuestionEntity } from '../../../lib/entities/question/SurveyQuestionEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { QuizState } from '../../../lib/enums/QuizState';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'VotingComponent';

  private _answers: Array<string> = [];
  private _questionText: string;
  private _selectedAnswers: Array<number> | string | number;
  private _currentQuestion: AbstractQuestionEntity;
  private _serverUnavailableModal: NgbModalRef;
  private readonly _destroy = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];

  public isSendingResponse: boolean;
  public hasTriggeredNavigation: boolean;
  public countdown: number;

  get answers(): Array<string> {
    return this._answers;
  }

  get questionText(): string {
    return this._questionText;
  }

  get selectedAnswers(): Array<number> | string | number {
    return this._selectedAnswers;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public quizService: QuizService,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private connectionService: ConnectionService,
    private questionTextService: QuestionTextService,
    private headerLabelService: HeaderLabelService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private quizApiService: QuizApiService,
    private memberApiService: MemberApiService,
    private ngbModal: NgbModal,
    private messageQueue: SimpleMQ,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
    }
    this.footerBarService.TYPE_REFERENCE = VotingComponent.TYPE;

    headerLabelService.headerLabel = 'component.voting.title';

    this.footerBarService.replaceFooterElements([]);
  }

  public sanitizeHTML(value: string): SafeHtml {
    // sanitizer.bypassSecurityTrustHtml is required for highslide and mathjax
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  public displayAnswerButtons(): boolean {
    return !this.displayRangedButtons() && //
           !this.displayFreetextInput();
  }

  public displayRangedButtons(): boolean {
    return this._currentQuestion && this._currentQuestion.TYPE === QuestionType.RangedQuestion;
  }

  public displayFreetextInput(): boolean {
    return this._currentQuestion && this._currentQuestion.TYPE === QuestionType.FreeTextQuestion;
  }

  public normalizeAnswerOptionIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public isSelected(index: number): boolean {
    return (
             Array.isArray(this._selectedAnswers) && this._selectedAnswers.indexOf(index) > -1
           ) || this._selectedAnswers === index;
  }

  public parseTextInput(event: Event): void {
    this._selectedAnswers = (
      <HTMLInputElement>event.target
    ).value;
  }

  public showSendResponseButton(): boolean {
    if (Array.isArray(this.selectedAnswers)) {
      return this.selectedAnswers.length > 0;
    }

    return Boolean(this.selectedAnswers) ?? false;
  }

  public toggleSelectAnswer(index: number): void {
    if (!Array.isArray(this._selectedAnswers)) {
      return;
    }

    this.isSelected(index) ? //
    this._selectedAnswers.splice(this._selectedAnswers.indexOf(index), 1) : //
    this.toggleSelectedAnswers() ? //
    this._selectedAnswers = [index] : //
    this._selectedAnswers.push(index);
  }

  public sendResponses(route?: string): void {
    this.isSendingResponse = true;

    this.hasTriggeredNavigation = true;
    this.router.navigate(this.getNextRoute(route));
    this.memberApiService.putResponse(this._selectedAnswers).subscribe((data: IMessage) => {
      if (data.status !== StatusProtocol.Success) {
        console.log('VotingComponent: PutResponse failed', data);
      }
    }, () => {});
  }

  public initData(): void {
    switch (this._currentQuestion.TYPE) {
      case QuestionType.RangedQuestion:
        this._selectedAnswers = null;
        break;
      case QuestionType.FreeTextQuestion:
        this._selectedAnswers = '';
        break;
      default:
        this._selectedAnswers = [];
    }
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      this._currentQuestion = this.quizService.currentQuestion();
      if ( //
        (this.quizService.quiz.currentQuestionIndex > -1 && this.quizService.quiz.currentStartTimestamp === -1) || //
        this.attendeeService.hasReponse() //
      ) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(this.getNextRoute());
        return;
      }

      this.initData();

      this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe((value: string | Array<string>) => {
        if (Array.isArray(value)) {
          this._answers = value;
        } else {
          this._questionText = value;
        }
      });

      this.questionTextService.changeMultiple(this._currentQuestion.answerOptionList.map(answer => answer.answerText)).subscribe();
      this.questionTextService.change(this._currentQuestion.questionText).subscribe();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
        this.handleMessages();
      }).catch(() => this.hasTriggeredNavigation = true);
    }

    this.connectionService.serverStatusEmitter.pipe(takeUntil(this._destroy)).subscribe(isConnected => {
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
    });
  }

  public ngOnDestroy(): void {
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));

    if (this.countdown) {
      this.countdown = 0;
    }

    this._destroy.next();
    this._destroy.complete();
  }

  public getQuestionAsSurvey(): SurveyQuestionEntity {
    return this.quizService.currentQuestion() as SurveyQuestionEntity;
  }

  public setResponse(value: string | number): void {
    this._selectedAnswers = value;
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this.countdown = payload.value;
        if (!this.countdown) {
          this.hasTriggeredNavigation = true;
          this.router.navigate(this.getNextRoute());
        }
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === payload.name) {
          this.hasTriggeredNavigation = true;
          this.router.navigate(['/']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.hasTriggeredNavigation = true;
        this.sendResponses('results');
      }),
    ]);
  }

  private toggleSelectedAnswers(): boolean {
    if (this._currentQuestion.TYPE === QuestionType.SurveyQuestion && !(
      this._currentQuestion as SurveyQuestionEntity
    ).multipleSelectionEnabled) {
      return true;
    }

    return [
      QuestionType.SingleChoiceQuestion,
      QuestionType.TrueFalseSingleChoiceQuestion,
      QuestionType.ABCDSingleChoiceQuestion,
      QuestionType.YesNoSingleChoiceQuestion,
    ].includes(this._currentQuestion.TYPE);
  }

  private getNextRoute(route?: string): Array<string> {
    return [
      '/quiz', 'flow', route ? route : environment.confidenceSliderEnabled && //
                                       this.quizService.quiz.sessionConfig.confidenceSliderEnabled ? 'confidence-rate' : 'results',
    ];
  }
}
