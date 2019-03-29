import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../../lib/AutoUnsubscribe';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { MessageProtocol, StatusProtocol } from '../../../../../lib/enums/Message';
import { IMessage } from '../../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { ServerUnavailableModalComponent } from '../../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuestionDetailsComponent implements OnInit, OnDestroy {
  public static TYPE = 'QuestionDetailsComponent';

  private _question: AbstractQuestionEntity;

  get question(): AbstractQuestionEntity {
    return this._question;
  }

  private _questionIndex: number;

  get questionIndex(): number {
    return this._questionIndex;
  }

  set questionIndex(value: number) {
    this._questionIndex = value;
  }

  private _questionText: string;

  get questionText(): string {
    return this._questionText;
  }

  private _answers: Array<string>;

  get answers(): Array<string> {
    return this._answers;
  }

  private _serverUnavailableModal: NgbModalRef;
  private _subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private questionTextService: QuestionTextService,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private ngbModal: NgbModal,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestionDetailsComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack, this.footerBarService.footerElemFullscreen,
    ]);

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
      this._serverUnavailableModal = this.ngbModal.open(ServerUnavailableModalComponent);
      this._serverUnavailableModal.result.finally(() => this._serverUnavailableModal = null);
    }));
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public normalizeAnswerIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public async ngOnInit(): Promise<void> {
    this.connectionService.initConnection().then(() => {
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });

    this._subscriptions.push(this.questionTextService.eventEmitter.subscribe((value: string | Array<string>) => {
      if (Array.isArray(value)) {
        this._answers = value;
      } else {
        this._questionText = value;
      }
    }));
    this.route.params.subscribe(async params => {
      this._questionIndex = +params['questionIndex'];
      if (this._questionIndex < 0 || this._questionIndex > this.quizService.quiz.currentQuestionIndex) {
        this.router.navigate(['/quiz', 'flow', 'results']);
        return;
      }
      if (this.quizService.quiz) {
        this._question = this.quizService.quiz.questionList[this._questionIndex];
      }
      this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
      this.questionTextService.change(this._question.questionText);
    });
  }

  public isCorrectAnswer(index: number): boolean {
    return this._questionIndex < this.quizService.quiz.currentQuestionIndex && this._question.answerOptionList[index].isCorrect;
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
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
        case MessageProtocol.UpdatedResponse:
          this.attendeeService.modifyResponse(data.payload);
          break;
        case MessageProtocol.NextQuestion:
          this.quizService.quiz.currentQuestionIndex = data.payload.nextQuestionIndex;
          break;
        case MessageProtocol.Start:
          this.quizService.quiz.currentStartTimestamp = data.payload.currentStartTimestamp;
          break;
        case MessageProtocol.Reset:
          this.attendeeService.clearResponses();
          this.quizService.quiz.currentQuestionIndex = -1;
          this.router.navigate(['/quiz', 'flow', 'lobby']);
          break;
        case MessageProtocol.Closed:
          this.router.navigate(['/']);
          break;
      }
      this.quizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
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
      case MessageProtocol.Start:
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case MessageProtocol.ReadingConfirmationRequested:
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
    }
  }

}
