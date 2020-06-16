import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleMQ } from 'ng2-simple-mq';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AnswerState } from '../../../lib/enums/AnswerState';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { IAnswerResult } from '../../../lib/interfaces/IAnswerResult';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-answer-result',
  templateUrl: './answer-result.component.html',
  styleUrls: ['./answer-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerResultComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'AnswerResultComponent';

  private _statusCssClass: string;
  private _confettiScriptRef: HTMLScriptElement;
  private readonly _destroy$ = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];
  private readonly _loadedConfetti = new ReplaySubject<void>(1);
  private readonly _abortRequest = new Subject();

  public hasTriggeredNavigation: boolean;
  public isLoading = true;
  public data: IAnswerResult;
  public isTeam: boolean;
  public onlyOneAvailableCorrectAnswer: boolean;
  public isLastQuestion: boolean;
  public readonly AnswerState = AnswerState;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private headerLabelService: HeaderLabelService,
    private quizService: QuizService,
    private quizApiService: QuizApiService,
    private messageQueue: SimpleMQ,
    private attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    headerLabelService.headerLabel = 'component.liveResults.title';
    this.footerBarService.replaceFooterElements([]);
    this.cd.markForCheck();
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadConfettiScript();

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.headerLabelService.headerLabelParams = {
        QUESTION_INDEX: (this.quizService.quiz.currentQuestionIndex + 1),
      };
      this.isTeam = this.quizService.quiz.sessionConfig.nicks.memberGroups.length > 0;
      this.isLastQuestion = this.quizService.quiz.currentQuestionIndex === this.quizService.quiz.questionList.length - 1;
      this.cd.markForCheck();
      this.handleMessages();
    }).catch(() => this.hasTriggeredNavigation = true);

    this.loadData();
  }

  public ngOnDestroy(): void {
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
    this._destroy$.next();
    this._destroy$.complete();
    this._loadedConfetti.complete();
    this.document.body.classList.remove(this._statusCssClass);
    if (this._confettiScriptRef) {
      (window as any).confetti?.stop();
      this.document.body.removeChild(this._confettiScriptRef);
    }
    const confettiElement = this.document.getElementById('confetti-canvas');
    if (confettiElement) {
      this.document.body.removeChild(confettiElement);
    }
  }

  private loadConfettiScript(): void {
    if (this.document.getElementById('confetti-js-script')) {
      this._loadedConfetti.next();
      return;
    }

    this._confettiScriptRef = this.document.createElement('script');
    this._confettiScriptRef.innerHTML = '';
    this._confettiScriptRef.id = 'confetti-js-script';
    this._confettiScriptRef.src = '/assets/js/confetti/confetti.min.js';
    this._confettiScriptRef.async = true;
    this._confettiScriptRef.defer = true;
    this._confettiScriptRef.onload = () => {
      (window as any).confetti.maxCount = 30;
      (window as any).confetti.speed = -2;
      this._loadedConfetti.next();
    };
    this.document.body.appendChild(this._confettiScriptRef);
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.quizService.quiz.currentStartTimestamp = payload.currentStartTimestamp;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        console.log('AnswerResultComponent: modify response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
        this.loadData();
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        if (environment.readingConfirmationEnabled) {
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        } else {
          this.router.navigate(['/quiz', 'flow', 'voting']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, () => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }),
    ]);
  }

  private loadData(): void {
    this._abortRequest.next();
    this.quizApiService.getAnswerResult().pipe(takeUntil(this._abortRequest)).subscribe(data => {
      this.data = data;
      this.onlyOneAvailableCorrectAnswer = data.amountAvailable === 1 && data.amountCorrect === data.amountAvailable;
      this._statusCssClass = data.state === AnswerState.Correct ? 'answer-result-correct' :
                             data.state === AnswerState.PartiallyCorrect ? 'answer-result-partially-correct' :
                             'answer-result-wrong';
      this.document.body.classList.remove('answer-result-correct', 'answer-result-partially-correct', 'answer-result-wrong');
      this.document.body.classList.add(this._statusCssClass);
      if (data.state === AnswerState.Correct) {
        this._loadedConfetti.pipe(take(1)).subscribe(() => (window as any).confetti.start());
      }
      this.isLoading = false;
      this.cd.markForCheck();
    });
  }
}
