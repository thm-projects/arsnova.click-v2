import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol } from '../../../lib/enums/Message';
import { QuizState } from '../../../lib/enums/QuizState';
import { IMemberSerialized } from '../../../lib/interfaces/entities/Member/IMemberSerialized';
import { IHasTriggeredNavigation } from '../../../lib/interfaces/IHasTriggeredNavigation';
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
export class ReadingConfirmationComponent implements OnInit, OnDestroy, IHasTriggeredNavigation {
  public static readonly TYPE = 'ReadingConfirmationComponent';

  private _serverUnavailableModal: NgbModalRef;
  private readonly _messageSubscriptions: Array<string> = [];
  private readonly _destroy = new Subject();

  public hasTriggeredNavigation: boolean;
  public questionIndex: number;
  public questionText: string;

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
    private memberApiService: MemberApiService, private ngbModal: NgbModal, private messageQueue: SimpleMQ,
  ) {

    this.footerBarService.TYPE_REFERENCE = ReadingConfirmationComponent.TYPE;
    headerLabelService.headerLabel = 'component.liveResults.reading_confirmation';
    this.footerBarService.replaceFooterElements([]);
  }

  public sanitizeHTML(value: string): string {
    // sanitizer.bypassSecurityTrustHtml is required for highslide
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`) as string;
  }

  public ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
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

    if (this.attendeeService.hasReadingConfirmation()) {
      this.hasTriggeredNavigation = true;
      this.router.navigate(['/quiz', 'flow', 'results']);
      return;
    }

    this.quizService.loadDataToPlay(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => {
      this.handleMessages();
    }).catch(() => this.hasTriggeredNavigation = true);

    this.questionTextService.eventEmitter.pipe(takeUntil(this._destroy)).subscribe((value: string) => {
      this.questionText = value;
    });

    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.quiz.state === QuizState.Inactive) {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
        return;
      }

      this.questionIndex = this.quizService.quiz.currentQuestionIndex;
      this.questionTextService.change(this.quizService.currentQuestion().questionText).subscribe();
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this._messageSubscriptions.forEach(id => this.messageQueue.unsubscribe(id));
  }

  public confirmReading(): void {
    this.memberApiService.putReadingConfirmationValue().subscribe(() => {
      this.hasTriggeredNavigation = true;
      this.router.navigate(['/quiz', 'flow', 'results']);
    });
  }

  private handleMessages(): void {
    this._messageSubscriptions.push(...[
      this.messageQueue.subscribe(MessageProtocol.NextQuestion, payload => {
        this.quizService.quiz.currentQuestionIndex = payload.nextQuestionIndex;
        sessionStorage.removeItem(StorageKey.CurrentQuestionIndex);
      }), this.messageQueue.subscribe(MessageProtocol.Start, payload => {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'voting']);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedResponse, payload => {
        console.log('ReadingConfirmationComponent: modifying response data for nickname', payload.nickname);
        this.attendeeService.modifyResponse(payload);
      }), this.messageQueue.subscribe(MessageProtocol.UpdatedSettings, payload => {
        this.quizService.quiz.sessionConfig = payload.sessionConfig;
      }), this.messageQueue.subscribe(MessageProtocol.Reset, payload => {
        this.attendeeService.clearResponses();
        this.quizService.quiz.currentQuestionIndex = -1;
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/quiz', 'flow', 'lobby']);
      }), this.messageQueue.subscribe(MessageProtocol.Closed, payload => {
        this.hasTriggeredNavigation = true;
        this.router.navigate(['/']);
      }), this.messageQueue.subscribe(MessageProtocol.Added, payload => {
        this.attendeeService.addMember(payload.member);
      }), this.messageQueue.subscribe(MessageProtocol.Removed, payload => {
        this.attendeeService.removeMember(payload.name);
      }), this.messageQueue.subscribe(MessageProtocol.AllPlayers, payload => {
        payload.members.forEach((elem: IMemberSerialized) => {
          this.attendeeService.addMember(elem);
        });
      }),
    ]);
  }
}
