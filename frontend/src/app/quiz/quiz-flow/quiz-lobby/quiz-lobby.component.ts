import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {ThemesService} from '../../../service/themes.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../service/settings.service';
import {ConnectionService} from '../../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AttendeeService, INickname} from '../../../service/attendee.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {Router} from '@angular/router';


export declare interface IMessage extends Object {
  status?: string;
  payload?: any;
  step: string;
}

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss']
})
export class QuizLobbyComponent implements OnInit, OnDestroy {
  get isOwner(): boolean {
    return this._isOwner;
  }

  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}`;
  private _isOwner: boolean;
  private _hashtag: string;

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private currentQuizService: CurrentQuizService,
    private themesService: ThemesService,
    private router: Router,
    private http: HttpClient,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    public attendeeService: AttendeeService) {
    if (activeQuestionGroupService.activeQuestionGroup) {
      footerBarService.replaceFooterElements([
        this.footerBarService.footerElemEditQuiz,
        this.footerBarService.footerElemStartQuiz,
        this.footerBarService.footerElemProductTour,
        this.footerBarService.footerElemNicknames,
        this.footerBarService.footerElemSound,
        this.footerBarService.footerElemReadingConfirmation,
        this.footerBarService.footerElemTheme,
        this.footerBarService.footerElemFullscreen,
        this.footerBarService.footerElemQRCode,
        this.footerBarService.footerElemResponseProgress,
        this.footerBarService.footerElemConfidenceSlider,
      ]);
      this._isOwner = true;
      this._hashtag = activeQuestionGroupService.activeQuestionGroup.hashtag;
      this.footerBarService.footerElemStartQuiz.linkTarget = (self) => {
        return self.isActive ? ['/quiz', 'flow', 'results'] : null;
      };
      this.footerBarService.footerElemEditQuiz.onClickCallback = function () {
        if (activeQuestionGroupService.activeQuestionGroup) {
          activeQuestionGroupService.close();
          attendeeService.cleanUp();
          connectionService.cleanUp();
        }
      };
    } else {
      footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack
      ]);
      this._isOwner = false;
      this._hashtag = currentQuizService.hashtag;
    }
    headerLabelService.setHeaderLabel('component.lobby.title');
  }

  private handleMessages() {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({status: 'STATUS:SUCCESSFULL', step: 'LOBBY:GET_PLAYERS', payload: {quizName: this._hashtag}});
    }
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:INACTIVE':
          setTimeout(this.handleMessages, 500);
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
          this.attendeeService.attendees = this.attendeeService.attendees.filter(player => player.name !== data.payload.name);
          break;
      }
      this._isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage) {
    switch (data.step) {
      case 'LOBBY:ALL_PLAYERS':
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

  private handleMessagesForAttendee(data: IMessage) {
    switch (data.step) {
      case 'QUIZ:NEXT_QUESTION':
        this.currentQuizService.currentQuestion = data.payload.question;
        break;
      case 'QUIZ:START':
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case 'QUIZ:READING_CONFIRMATION_REQUESTED':
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case 'MEMBER:REMOVED':
        const existingNickname = window.sessionStorage.getItem(`${this._hashtag}_nick`);
        if (existingNickname === data.payload.name) {
          window.sessionStorage.removeItem(`${this._hashtag}_nick`);
          this.router.navigate(['/']);
        }
        break;
    }
  }

  kickMember(name: string): void {
    const quizName = this._hashtag;
    this.http.delete(`${this._httpApiEndpoint}/lobby/${quizName}/member/${name}`)
        .subscribe(
          (data: IMessage) => {
            if (data.status !== 'STATUS:SUCCESSFUL') {
              console.log(data);
            }
          }
        );
  }

  getComplementaryColor(value: string): string {
    const color: number = parseInt(` 0x${value}`, 16);
    return ('000000' + ((0xffffff ^ color)
      .toString(16))).slice(-6);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  transformForegroundColor(rgbObj: {r: string, g: string, b: string}): string {
    const o = Math.round(((parseInt(rgbObj.r, 10) * 299) + (parseInt(rgbObj.g, 10) * 587) + (parseInt(rgbObj.b, 10) * 114)) / 1000);
    return o < 125 ? 'ffffff' : '000000';
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  addTestPlayer(name: string) {
    this.http.put(`${this._httpApiEndpoint}/lobby/member`, {
      quizName: this._hashtag,
      nickname: name
    }).subscribe(
      (data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          window.sessionStorage.setItem(`${this._hashtag}_nick`, name);
          window.sessionStorage.setItem('webSocketAuthorization', data.payload.webSocketAuthorization);
          this.connectionService.authorizeWebSocket(this._hashtag);
        }
      }
    );
  }

  ngOnInit() {
    this.themesService.updateCurrentlyUsedTheme();
    this.connectionService.initConnection().then(() => {
      if (this._isOwner) {
        this.http.put(`${this._httpApiEndpoint}/lobby`, {
          quiz: this.activeQuestionGroupService.activeQuestionGroup.serialize()
        }).subscribe(
          () => {
            this.headerLabelService.setHeaderLabel('component.lobby.waiting_for_players');
            this.connectionService.authorizeWebSocketAsOwner(this._hashtag);
            this.handleMessages();
            this.addTestPlayer('testnick');
          },
          (error) => {
            console.log('error', error);
          }
        );
      } else {
        this.headerLabelService.setHeaderLabel('component.lobby.waiting_for_players');
        this.connectionService.authorizeWebSocket(this._hashtag);
        this.handleMessages();
      }
    });
  }

  ngOnDestroy() {
  }

}
