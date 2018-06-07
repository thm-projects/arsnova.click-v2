import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IMessage, INickname } from 'arsnova-click-v2-types/src/common';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { DefaultSettings } from '../../../../lib/default.settings';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TrackingService } from '../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss'],
})
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
  private _kickMemberModalRef: NgbActiveModal;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public currentQuizService: CurrentQuizService,
    public attendeeService: AttendeeService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private router: Router,
    private http: HttpClient,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private modalService: NgbModal,
    private trackingService: TrackingService,
  ) {

    this.headerLabelService.headerLabel = this.currentQuizService.quiz.hashtag;

    this.footerBarService.TYPE_REFERENCE = QuizLobbyComponent.TYPE;

    (async () => {
      await this.connectionService.initConnection();
      if (this.currentQuizService.isOwner) {
        this.trackingService.trackConversionEvent({ action: QuizLobbyComponent.TYPE });
        this.addFooterElementsAsOwner();
        this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      } else {
        this.addFooterElementsAsAttendee();
        this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      }
      this.handleMessages();
    })();
  }

  public openKickMemberModal(content: string, name: string): void {
    this._kickMemberModalRef = this.modalService.open(content);
    this._nickToRemove = name;
  }

  public async kickMember(name: string): Promise<void> {
    this._kickMemberModalRef.close();
    const quizName = this.currentQuizService.quiz.hashtag;
    const data = await this.http.delete<IMessage>(`${DefaultSettings.httpApiEndpoint}/member/${quizName}/${name}`).toPromise();
    if (data.status !== 'STATUS:SUCCESSFUL') {
      console.log(data);
    }
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
  }

  private addFooterElementsAsAttendee(): void {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  private addFooterElementsAsOwner(): void {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemEditQuiz,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemProductTour,
      this.footerBarService.footerElemReadingConfirmation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemQRCode,
      this.footerBarService.footerElemResponseProgress,
      this.footerBarService.footerElemConfidenceSlider,
    ]);
    if (isPlatformBrowser(this.platformId)) {
      this.qrCodeContent = `${document.location.origin}/quiz/${encodeURIComponent(this.currentQuizService.quiz.hashtag.toLowerCase())}`;
    }
    this.addFooterElemClickCallbacksAsOwner();
  }

  private addFooterElemClickCallbacksAsOwner(): void {
    this.footerBarService.footerElemStartQuiz.onClickCallback = () => {
      if (!this.attendeeService.attendees.length) {
        return;
      }
      const target = this.currentQuizService.quiz.sessionConfig.readingConfirmationEnabled ?
                     'reading-confirmation' : 'start';
      this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/${target}`, {
        quizName: this.currentQuizService.quiz.hashtag,
      }).subscribe((data: IMessage) => {
        this.currentQuizService.readingConfirmationRequested = data.step === 'QUIZ:READING_CONFIRMATION_REQUESTED';
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
    this.footerBarService.footerElemEditQuiz.onClickCallback = () => {
      if (this.currentQuizService.quiz) {
        if (isPlatformBrowser(this.platformId)) {
          const questionGroupSerialized = JSON.parse(window.localStorage.getItem(this.currentQuizService.quiz.hashtag));
          this.activeQuestionGroupService.activeQuestionGroup =
            questionGroupReflection[questionGroupSerialized.TYPE](questionGroupSerialized);
        }
        this.currentQuizService.cleanUp();
        this.attendeeService.cleanUp();
        this.connectionService.cleanUp();
      }
      this.router.navigate(['/quiz', 'manager', 'overview']);
    };
  }

  private handleMessages(): void {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({
        status: 'STATUS:SUCCESSFUL', step: 'LOBBY:GET_PLAYERS', payload: {
          quizName: this.currentQuizService.quiz.hashtag,
        },
      });
    }
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:INACTIVE':
          setTimeout(this.handleMessages.bind(this), 500);
          break;
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case 'MEMBER:ADDED':
          this.attendeeService.addMember(data.payload.member);
          break;
        case 'MEMBER:REMOVED':
          this.attendeeService.removeMember(data.payload.name);
          break;
      }
      this.currentQuizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage): void {
    switch (data.step) {
      case 'LOBBY:ALL_PLAYERS':
        this.footerBarService.footerElemStartQuiz.isActive = !!this.attendeeService.attendees.length;
        break;
      case 'MEMBER:ADDED':
        this.footerBarService.footerElemStartQuiz.isActive = true;
        break;
      case 'MEMBER:REMOVED':
        if (!this.attendeeService.attendees.length) {
          this.footerBarService.footerElemStartQuiz.isActive = false;
        }
        break;
    }
  }

  private handleMessagesForAttendee(data: IMessage): void {
    switch (data.step) {
      case 'QUIZ:NEXT_QUESTION':
        this.currentQuizService.questionIndex = data.payload.questionIndex;
        break;
      case 'QUIZ:START':
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case 'QUIZ:READING_CONFIRMATION_REQUESTED':
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case 'MEMBER:REMOVED':
        if (isPlatformBrowser(this.platformId)) {
          const existingNickname = window.sessionStorage.getItem(`config.nick`);
          if (existingNickname === data.payload.name) {
            this.router.navigate(['/']);
          }
        }
        break;
      case 'LOBBY:CLOSED':
        this.router.navigate(['/']);
        break;
    }
  }

}
