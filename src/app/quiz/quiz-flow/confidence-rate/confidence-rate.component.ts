import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol } from '../../../../lib/enums/Message';
import { QuizState } from '../../../../lib/enums/QuizState';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
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
}) //
@AutoUnsubscribe('_subscriptions')
export class ConfidenceRateComponent implements OnInit, OnDestroy {
  public static TYPE = 'ConfidenceRateComponent';

  private _confidenceValue = 100;

  get confidenceValue(): number {
    return this._confidenceValue;
  }

  private _serverUnavailableModal: NgbModalRef;
  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];
  private readonly _messageSubscriptions: Array<string> = [];

  constructor(
    public quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private router: Router,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private memberApiService: MemberApiService,
    private ngbModal: NgbModal, private messageQueue: SimpleMQ,
  ) {
    headerLabelService.headerLabel = 'component.liveResults.confidence_grade';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.router.navigate(['/']);
        return;
      }
    }));

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.handleMessages();
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
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
  }

  public getConfidenceLevelTranslation(): string {
    if (this.confidenceValue === 100) {
      return 'component.voting.confidence_level.very_sure';
    } else if (this.confidenceValue > 70) {
      return 'component.voting.confidence_level.quite_sure';
    } else if (this.confidenceValue > 50) {
      return 'component.voting.confidence_level.unsure';
    } else if (this.confidenceValue > 20) {
      return 'component.voting.confidence_level.not_sure';
    } else {
      return 'component.voting.confidence_level.no_idea';
    }
  }

  public updateConficence(event: Event): void {
    this._confidenceValue = parseInt((<HTMLInputElement>event.target).value, 10);
  }

  public async sendConfidence(): Promise<Subscription> {
    return this.memberApiService.putConfidenceValue(this._confidenceValue).subscribe((data: IMessage) => {
      this.router.navigate(['/quiz', 'flow', 'results']);
    });
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.quizService.quiz.currentStartTimestamp = payload.currentStartTimestamp;
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.Stop, payload => {
        this.router.navigate(['/quiz', 'flow', 'results']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        console.log('ConfidenceRateComponent: modify response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.ReadingConfirmationRequested, payload => {
        if (environment.readingConfirmationEnabled) {
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        } else {
          this.router.navigate(['/quiz', 'flow', 'voting']);
        }
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        this.attendeeService.removeMember(payload.name);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.router.navigate(['/']);
      }),
    ]);
  }

}
