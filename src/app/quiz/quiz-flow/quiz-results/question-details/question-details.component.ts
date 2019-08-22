import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AutoUnsubscribe } from '../../../../../lib/AutoUnsubscribe';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { StorageKey } from '../../../../../lib/enums/enums';
import { MessageProtocol } from '../../../../../lib/enums/Message';
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
  private readonly _subscriptions: Array<Subscription> = [];
  private readonly _messageSubscriptions: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private questionTextService: QuestionTextService,
    private attendeeService: AttendeeService,
    private connectionService: ConnectionService,
    private footerBarService: FooterBarService,
    private ngbModal: NgbModal, private messageQueue: SimpleMQ,
  ) {

    this.footerBarService.TYPE_REFERENCE = QuestionDetailsComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public normalizeAnswerIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public async ngOnInit(): Promise<void> {
    this._subscriptions.push(this.questionTextService.eventEmitter.subscribe((value: string | Array<string>) => {
      if (Array.isArray(value)) {
        this._answers = value;
      } else {
        this._questionText = value;
      }
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

    this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];

      this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
        if (!quiz) {
          return;
        }

        if (this._questionIndex < 0 || this._questionIndex > this.quizService.quiz.currentQuestionIndex) {
          this.router.navigate(['/quiz', 'flow', 'results']);
          return;
        }
        if (this.quizService.quiz) {
          this._question = this.quizService.quiz.questionList[this._questionIndex];
          this.questionTextService.changeMultiple(this._question.answerOptionList.map(answer => answer.answerText));
          this.questionTextService.change(this._question.questionText);
        }
      }));

      this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
        this.handleMessages();
      });
    });
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.AllPlayers, payload => {
        payload.members.forEach((elem: IMemberSerialized) => {
          this.attendeeService.addMember(elem);
        });
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.quizService.quiz.currentStartTimestamp = payload.currentStartTimestamp;
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

  private handleMessagesForOwner(): void {}

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
      }),
    ]);
  }
}
