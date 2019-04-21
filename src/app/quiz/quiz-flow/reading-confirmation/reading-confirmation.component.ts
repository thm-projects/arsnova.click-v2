import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StorageKey } from '../../../../lib/enums/enums';
import { MessageProtocol } from '../../../../lib/enums/Message';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss'],
})
export class ReadingConfirmationComponent implements OnInit, OnDestroy {
  public static TYPE = 'ReadingConfirmationComponent';

  public questionIndex: number;
  public questionText: string;
  private _subscriptions: Array<Subscription> = [];
  private _serverUnavailableModal: NgbModalRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    private attendeeService: AttendeeService,
    private router: Router,
    private quizService: QuizService,
    private questionTextService: QuestionTextService,
    private sanitizer: DomSanitizer,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private memberApiService: MemberApiService,
    private ngbModal: NgbModal,
  ) {

    this.footerBarService.TYPE_REFERENCE = ReadingConfirmationComponent.TYPE;
    headerLabelService.headerLabel = 'component.liveResults.reading_confirmation';
    this.footerBarService.replaceFooterElements([]);

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

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this.connectionService.initConnection().then(() => {
        this.connectionService.connectToChannel(this.quizService.quiz.name);
        this.handleMessages();
      });

      this.attendeeService.restoreMembers();
      this.questionIndex = this.quizService.quiz.currentQuestionIndex;
      this.questionTextService.change(this.quizService.currentQuestion().questionText);
    }));

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName));

    this._subscriptions.push(this.questionTextService.eventEmitter.subscribe((value: string) => {
      this.questionText = value;
    }));
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  public confirmReading(): void {
    this.memberApiService.putReadingConfirmationValue().subscribe(() => {
      this.router.navigate(['/quiz', 'flow', 'results']);
    });
  }

  private handleMessages(): void {
    this._subscriptions.push(this.connectionService.dataEmitter.subscribe((data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.Inactive:
          setTimeout(this.handleMessages.bind(this), 500);
          break;
        case MessageProtocol.Start:
          this.router.navigate(['/quiz', 'flow', 'voting']);
          break;
        case MessageProtocol.UpdatedResponse:
          console.log('ReadingConfirmationComponent: modifying response data for nickname', data.payload.nickname);
          this.attendeeService.modifyResponse(data.payload);
          break;
        case MessageProtocol.UpdatedSettings:
          this.quizService.quiz.sessionConfig = data.payload.sessionConfig;
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case MessageProtocol.Closed:
          this.router.navigate(['/']);
          break;
        case MessageProtocol.Added:
          this.attendeeService.addMember(data.payload.member);
          break;
        case MessageProtocol.Removed:
          this.attendeeService.removeMember(data.payload.name);
          break;
        case MessageProtocol.AllPlayers:
          data.payload.members.forEach((elem: IMemberSerialized) => {
            this.attendeeService.addMember(elem);
          });
          break;
      }
    }));
  }

}
