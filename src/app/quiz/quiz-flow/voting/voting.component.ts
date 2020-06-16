import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { SurveyQuestionEntity } from '../../../lib/entities/question/SurveyQuestionEntity';
import { AudioPlayerConfigTarget } from '../../../lib/enums/AudioPlayerConfigTarget';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { QuizState } from '../../../lib/enums/QuizState';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { IAudioPlayerConfig } from '../../../lib/interfaces/IAudioConfig';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VotingComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'VotingComponent';

  private _answers: Array<string> = [];
  private _questionText: string;
  private _selectedAnswers: Array<string> | string | number = [];
  private _currentQuestion: AbstractQuestionEntity;
  private _serverUnavailableModal: NgbModalRef;
  private readonly _destroy = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];

  public isSendingResponse: boolean;
  public countdown: number;

  public musicConfig: IAudioPlayerConfig;
  public hasTriggeredNavigation: boolean;

  get answers(): Array<string> {
    return this._answers;
  }

  get questionText(): string {
    return this._questionText;
  }

  get selectedAnswers(): Array<string> | string | number {
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
    private cd: ChangeDetectorRef,
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

  public isSelected(elem: string): boolean {
    return (
             Array.isArray(this._selectedAnswers) && this._selectedAnswers.indexOf(elem) > -1
           ) || this._selectedAnswers === elem;
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

  public toggleSelectAnswer(elem: string): void {
    if (!Array.isArray(this._selectedAnswers)) {
      return;
    }

    this.isSelected(elem) ? //
    this._selectedAnswers.splice(this._selectedAnswers.indexOf(elem), 1) : //
    this.toggleSelectedAnswers() ? //
    this._selectedAnswers = [elem] : //
    this._selectedAnswers.push(elem);
  }

  public sendResponses(route?: string): void {
    this.isSendingResponse = true;
    this.hasTriggeredNavigation = true;

    let result: Array<number> | number | string;
    if (Array.isArray(this._selectedAnswers)) {
      result = this._selectedAnswers.map(v => this._answers.findIndex(answer => answer === v));
    } else {
      result = this._selectedAnswers;
    }

    this.memberApiService.putResponse(result).subscribe((data: IMessage) => {
      if (data.status !== StatusProtocol.Success) {
        console.log('VotingComponent: PutResponse failed', data);
      }
      this.router.navigate(this.getNextRoute(route));
    }, err => {
      console.log('VotingComponent: PutResponse failed', err);
      this.router.navigate(this.getNextRoute(route));
    });
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

      if (this.hasTriggeredNavigation) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      this._currentQuestion = this.quizService.currentQuestion();
      this.initData();

      if (!this.quizService.isOwner && quiz.sessionConfig.music.shared.countdownRunning) {
        this.musicConfig = {
          autostart: true,
          loop: true,
          hideControls: true,
          original_volume: String(this.quizService.quiz.sessionConfig.music.volumeConfig.useGlobalVolume ?
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.global :
                                  this.quizService.quiz.sessionConfig.music.volumeConfig.countdownRunning),
          src: this.quizService.quiz.sessionConfig.music.titleConfig.countdownRunning,
          target: AudioPlayerConfigTarget.countdownRunning
        };
      }

      if ( //
        (this.quizService.quiz.currentQuestionIndex > -1 && this.quizService.quiz.currentStartTimestamp === -1) || //
        this.attendeeService.hasResponse() //
      ) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(this.getNextRoute());
        return;
      }

      this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe((value: string | Array<string>) => {
        if (Array.isArray(value)) {
          this._answers = value;
        } else {
          this._questionText = value;
        }
        this.cd.markForCheck();
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
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.countdown = payload.value;
        if (!this.countdown) {
          this.hasTriggeredNavigation = true;
          this.sendResponses('results');
        }
        this.cd.markForCheck();
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        const existingNickname = sessionStorage.getItem(StorageKey.CurrentNickName);
        if (existingNickname === payload.name) {
          this.hasTriggeredNavigation = true;
          this.router.navigate(['/']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.sendResponses('results');
      }),
    ]);
  }

  private toggleSelectedAnswers(): boolean {
    if ([QuestionType.SurveyQuestion, QuestionType.ABCDSurveyQuestion].includes(this._currentQuestion.TYPE) &&
        !(this._currentQuestion as SurveyQuestionEntity).multipleSelectionEnabled) {
      return true;
    }

    return [
      QuestionType.SingleChoiceQuestion,
      QuestionType.TrueFalseSingleChoiceQuestion,
      QuestionType.YesNoSingleChoiceQuestion,
    ].includes(this._currentQuestion.TYPE);
  }

  private getNextRoute(route?: string): Array<string> {
    const hasConfidenceEnabled = environment.confidenceSliderEnabled && this.quizService.quiz.sessionConfig.confidenceSliderEnabled;

    return [
      '/quiz', 'flow', route ? route : (hasConfidenceEnabled ? 'confidence-rate' : 'results'),
    ];
  }
}
