import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol } from '../../../../lib/enums/Message';
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
export class ConfidenceRateComponent {
  public static TYPE = 'ConfidenceRateComponent';

  private _confidenceValue = 100;

  get confidenceValue(): number {
    return this._confidenceValue;
  }

  private _serverUnavailableModal: NgbModalRef;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _subscriptions: Array<Subscription> = [];

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
  ) {

    headerLabelService.headerLabel = 'component.liveResults.confidence_grade';
    this.footerBarService.replaceFooterElements([]);

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this.initData();
    }));

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

  public initData(): void {
    this.connectionService.initConnection().then(() => {
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });
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
    this.connectionService.dataEmitter.subscribe((data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.NextQuestion:
          this.quizService.quiz.currentQuestionIndex = data.payload.nextQuestionIndex;
          break;
        case MessageProtocol.Start:
          this.quizService.quiz.currentStartTimestamp = data.payload.currentStartTimestamp;
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case MessageProtocol.Stop:
          this.router.navigate(['/quiz', 'flow', 'results']);
          break;
        case MessageProtocol.UpdatedResponse:
          console.log('modify response data for nickname in confidence rate view', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload);
          break;
        case MessageProtocol.ReadingConfirmationRequested:
          this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case MessageProtocol.Added:
          this.attendeeService.addMember(data.payload.member);
          break;
        case MessageProtocol.Removed:
          this.attendeeService.removeMember(data.payload.name);
          break;
        case MessageProtocol.Closed:
          this.router.navigate(['/']);
          break;
      }
    });
  }

}
