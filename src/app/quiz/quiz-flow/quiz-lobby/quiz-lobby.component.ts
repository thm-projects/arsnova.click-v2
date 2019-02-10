import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../lib/AutoUnsubscribe';
import { QuizEntity } from '../../../../lib/entities/QuizEntity';
import { MessageProtocol } from '../../../../lib/enums/Message';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { IMemberSerialized } from '../../../../lib/interfaces/entities/Member/IMemberSerialized';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TrackingService } from '../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss'],
}) //
@AutoUnsubscribe('_subscriptions')
export class QuizLobbyComponent implements OnDestroy {
  public static TYPE = 'QuizLobbyComponent';

  private _showQrCode = false;

  get showQrCode(): boolean {
    return this._showQrCode;
  }

  set showQrCode(value: boolean) {
    this._showQrCode = value;
  }

  private _qrCodeContent = '';

  get qrCodeContent(): string {
    return this._qrCodeContent;
  }

  set qrCodeContent(value: string) {
    this._qrCodeContent = value;
  }

  private _nickToRemove: string;

  get nickToRemove(): string {
    return this._nickToRemove;
  }

  private _reconnectTimeout: any;
  private _kickMemberModalRef: NgbActiveModal;
  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public quizService: QuizService,
    public attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private router: Router,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    private memberApiService: MemberApiService,
    private quizApiService: QuizApiService,
  ) {
    console.log('lobby quiz initializing');

    this.quizService.loadDataToPlay(sessionStorage.getItem('currentQuizName'));
    this._subscriptions.push(this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (!quiz) {
        return;
      }

      if (this.quizService.isOwner) {
        console.log('quiz in lobby set', this.quizService.quiz);
        this.handleNewQuiz(this.quizService.quiz);
        this.attendeeService.restoreMembers();
        this.footerBarService.footerElemStartQuiz.isActive = this.attendeeService.attendees.length > 0;
      } else {
        this.handleNewAttendee();
        this.attendeeService.restoreMembers();
      }
    }));

    this.footerBarService.TYPE_REFERENCE = QuizLobbyComponent.TYPE;
  }

  public openKickMemberModal(content: string, name: string): void {
    if (!this.quizService.isOwner) {
      return;
    }

    this._kickMemberModalRef = this.modalService.open(content);
    this._nickToRemove = name;
  }

  public kickMember(name: string): void {
    this._kickMemberModalRef.close();
    this.memberApiService.deleteMember(this.quizService.quiz.name, name).subscribe();
  }

  public hexToRgb(hex): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  public transformForegroundColor(rgbObj: { r: number, g: number, b: number }): string {
    const o = Math.round(((rgbObj.r * 299) + (rgbObj.g * 587) + (rgbObj.b * 114)) / 1000);
    return o < 125 ? 'ffffff' : '000000';
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseNickname(value: string): SafeHtml {

    if (value.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();
    this.footerBarService.footerElemBack.restoreClickCallback();
    clearTimeout(this._reconnectTimeout);
  }

  private handleNewQuiz(quiz: QuizEntity): void {
    console.log('lobby quiz initialized', quiz);
    if (!quiz) {
      return;
    }

    this.headerLabelService.headerLabel = this.quizService.quiz.name;

    this.connectionService.initConnection().then(() => {
      console.log('connection in lobby initialized');
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });

    this.trackingService.trackConversionEvent({ action: QuizLobbyComponent.TYPE });
    this.addFooterElementsAsOwner();
  }

  private addFooterElementsAsAttendee(): void {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
    this.footerBarService.footerElemBack.onClickCallback = async () => {
      this.attendeeService.cleanUp();
      this.connectionService.cleanUp();
      this.router.navigate(['/']);
    };
  }

  private addFooterElementsAsOwner(): void {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemEditQuiz,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemReadingConfirmation,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemQRCode,
      this.footerBarService.footerElemResponseProgress,
      this.footerBarService.footerElemConfidenceSlider,
    ]);
    if (isPlatformBrowser(this.platformId)) {
      this.qrCodeContent = `${document.location.origin}/quiz/${encodeURIComponent(this.quizService.quiz.name.toLowerCase())}`;
    }
    this.addFooterElemClickCallbacksAsOwner();
  }

  private addFooterElemClickCallbacksAsOwner(): void {
    this.footerBarService.footerElemStartQuiz.onClickCallback = () => {
      if (!this.attendeeService.attendees.length) {
        return;
      }
      this.quizApiService.nextStep().subscribe((data: IMessage) => {
        this.quizService.readingConfirmationRequested = data.step === MessageProtocol.ReadingConfirmationRequested;
        this.router.navigate(['/quiz', 'flow', 'results']);
      });
    };
    this.footerBarService.footerElemQRCode.onClickCallback = () => {
      if (isPlatformBrowser(this.platformId)) {
        const classList = document.getElementsByClassName('qr-code-element').item(0).classList;
        classList.toggle('d-none');
        classList.toggle('d-flex');
      }
    };
    this.footerBarService.footerElemEditQuiz.onClickCallback = async () => {
      this.quizService.close();
      this.attendeeService.cleanUp();
      this.connectionService.cleanUp();
      this.router.navigate(['/quiz', 'manager', 'overview']);
    };
  }

  private handleMessages(): void {
    this.connectionService.socket.subscribe(async (data: IMessage) => {
      switch (data.step) {
        case MessageProtocol.Inactive:
          this._reconnectTimeout = setTimeout(this.handleMessages.bind(this), 500);
          break;
        case MessageProtocol.AllPlayers:
          data.payload.members.forEach((elem: IMemberSerialized) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case MessageProtocol.Added:
          this.attendeeService.addMember(data.payload.member);
          break;
        case MessageProtocol.Removed:
          this.attendeeService.removeMember(data.payload.name);
          break;
        case MessageProtocol.NextQuestion:
          this.quizService.quiz.currentQuestionIndex = data.payload.nextQuestionIndex;
          break;
        case MessageProtocol.Start:
          this.quizService.quiz.currentStartTimestamp = data.payload.currentStartTimestamp;
          break;
      }
      this.quizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage): void {
    switch (data.step) {
      case MessageProtocol.AllPlayers:
        this.footerBarService.footerElemStartQuiz.isActive = this.attendeeService.attendees.length > 0;
        break;
      case MessageProtocol.Added:
        this.footerBarService.footerElemStartQuiz.isActive = true;
        break;
      case MessageProtocol.Removed:
        if (!this.attendeeService.attendees.length) {
          this.footerBarService.footerElemStartQuiz.isActive = false;
        }
        break;
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
      case MessageProtocol.Removed:
        if (isPlatformBrowser(this.platformId)) {
          const existingNickname = sessionStorage.getItem('nick');
          if (existingNickname === data.payload.name) {
            this.router.navigate(['/']);
          }
        }
        break;
      case MessageProtocol.Closed:
        this.router.navigate(['/']);
        break;
    }
  }

  private handleNewAttendee(): void {
    console.log('lobby quiz status initialized', this.quizService.quiz);

    this.headerLabelService.headerLabel = this.quizService.quiz.name;

    this.connectionService.initConnection().then(() => {
      this.connectionService.connectToChannel(this.quizService.quiz.name);
      this.handleMessages();
    });

    this.addFooterElementsAsAttendee();
  }
}
