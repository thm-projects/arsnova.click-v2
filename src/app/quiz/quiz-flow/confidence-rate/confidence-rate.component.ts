import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { QuestionType } from '../../../lib/enums/QuestionType';
import { QuizState } from '../../../lib/enums/QuizState';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss'],
})
export class ConfidenceRateComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'ConfidenceRateComponent';

  private _confidenceValue = '100';
  private _serverUnavailableModal: NgbModalRef;
  private _isRankableQuestion: boolean;
  private _hasCountdownLeft = false;

  private readonly _destroy = new Subject();
  private readonly _messageSubscriptions: Array<string> = [];

  public hasTriggeredNavigation: boolean;

  get confidenceValue(): string {
    return this._confidenceValue;
  }

  set confidenceValue(value: string) {
    this._confidenceValue = value;
  }

  constructor(
    public quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private memberApiService: MemberApiService,
    private ngbModal: NgbModal,
    private messageQueue: SimpleMQ,
  ) {
    headerLabelService.headerLabel = 'component.liveResults.confidence_grade';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    if (this.hasTriggeredNavigation) {
      return;
    }

    this.quizService.quizUpdateEmitter.pipe(take(1), takeUntil(this._destroy)).subscribe(quiz => {
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

      this._isRankableQuestion = ![QuestionType.SurveyQuestion, QuestionType.ABCDSurveyQuestion]
        .includes(this.quizService.currentQuestion().TYPE);
    });

    if (this.attendeeService.hasConfidenceValue()) {
      this.hasTriggeredNavigation = true;
      this.router.navigate(['/quiz', 'flow', 'results']);
      return;
    }

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.handleMessages();
    }).catch(() => this.hasTriggeredNavigation = true);

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
    this._destroy.next();
    this._destroy.complete();
  }

  public getConfidenceLevelTranslation(): string {
    const parsedConfidence = parseInt(this.confidenceValue, 10);
    if (parsedConfidence === 100) {
      return 'component.voting.confidence_level.very_sure';
    } else if (parsedConfidence > 70) {
      return 'component.voting.confidence_level.quite_sure';
    } else if (parsedConfidence > 50) {
      return 'component.voting.confidence_level.unsure';
    } else if (parsedConfidence > 20) {
      return 'component.voting.confidence_level.not_sure';
    } else {
      return 'component.voting.confidence_level.no_idea';
    }
  }

  public async sendConfidence(): Promise<Subscription> {
    if (this.hasTriggeredNavigation) {
      return;
    }

    return this.memberApiService.putConfidenceValue(parseInt(this._confidenceValue, 10)).subscribe((data: IMessage) => {
      this.hasTriggeredNavigation = true;
      this.router.navigate(['/quiz', 'flow', (!this._hasCountdownLeft && this._isRankableQuestion ? 'answer-result' : 'results')]);
    });
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
        console.log('ConfidenceRateComponent: modify response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
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
      }), this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        this.attendeeService.removeMember(payload.name);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, () => {
        if (this.hasTriggeredNavigation) {
          return;
        }

        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }), this.messageQueue.subscribe(MessageProtocol.Countdown, payload => {
        this._hasCountdownLeft = payload.value > 0;
      }), this.messageQueue.subscribe(MessageProtocol.Stop, () => {
        this._hasCountdownLeft = false;
      })
    ]);
  }

}
