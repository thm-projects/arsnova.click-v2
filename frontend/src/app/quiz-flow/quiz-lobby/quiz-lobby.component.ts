import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {ThemesService} from '../../service/themes.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../service/settings.service';
import {ConnectionService} from '../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AttendeeService, INickname} from '../../service/attendee.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
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
    private attendeeService: AttendeeService) {
    if (activeQuestionGroupService.activeQuestionGroup) {
      footerBarService.replaceFooterElments([
        FooterBarComponent.footerElemEditQuiz,
        FooterBarComponent.footerElemStartQuiz,
        FooterBarComponent.footerElemProductTour,
        FooterBarComponent.footerElemNicknames,
        FooterBarComponent.footerElemSound,
        FooterBarComponent.footerElemReadingConfirmation,
        FooterBarComponent.footerElemTheme,
        FooterBarComponent.footerElemFullscreen,
        FooterBarComponent.footerElemQRCode,
        FooterBarComponent.footerElemResponseProgress,
        FooterBarComponent.footerElemConfidenceSlider,
      ]);
      this._isOwner = true;
      this._hashtag = activeQuestionGroupService.activeQuestionGroup.hashtag;
      FooterBarComponent.footerElemStartQuiz.linkTarget = (self) => {
        return self.isActive ? '/quiz-results' : null;
      };
    } else {
      footerBarService.replaceFooterElments([
        FooterBarComponent.footerElemBack
      ]);
      this._isOwner = false;
      this._hashtag = currentQuizService.hashtag;
    }
    headerLabelService.setHeaderLabel('component.lobby.title');
  }

  private handleIncomingPlayers() {
    this.connectionService.socket.subscribe((message) => {
      const data = message;
      switch (data.step) {
        case 'LOBBY:INACTIVE':
          setTimeout(this.handleIncomingPlayers, 500);
          break;
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            console.log(elem);
            this.attendeeService.addMember(elem);
          });
          FooterBarComponent.footerElemStartQuiz.isActive = true;
          break;
        case 'MEMBER:ADDED':
          this.attendeeService.addMember(data.payload.member);
          FooterBarComponent.footerElemStartQuiz.isActive = true;
          break;
        case 'MEMBER:REMOVED':
          this.attendeeService.attendees = this.attendeeService.attendees.filter(player => player.name !== data.payload.name);
          if (!this.attendeeService.attendees.length) {
            FooterBarComponent.footerElemStartQuiz.isActive = false;
          }
          const existingNickname = window.sessionStorage.getItem(`${this._hashtag}_nick`);
          if (existingNickname === data.payload.name) {
            window.sessionStorage.removeItem(`${this._hashtag}_nick`);
            this.router.navigate(['/']);
          }
          break;
      }
    });

    if (!this._isOwner) {
      this.connectionService.socket.subscribe((message) => {
        const data = message;
        switch (data.step) {
          case 'LOBBY:ALL_PLAYERS':
            data.payload.members.forEach((elem: INickname) => {
              this.attendeeService.addMember(elem);
            });
            FooterBarComponent.footerElemStartQuiz.isActive = true;
            break;
          case 'QUIZ:NEXT_QUESTION':
            this.currentQuizService.currentQuestion = data.payload.question;
            break;
          case 'QUIZ:START':
            this.router.navigate(['/voting']);
            break;
        }
      });
    }
    this.connectionService.socket.next({
      step: 'LOBBY:GET_PLAYERS'
    });
  }

  isOwnNick(name: string): boolean {
    return name === window.sessionStorage.getItem(`${this._hashtag}_nick`);
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

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  addTestPlayer(name: string) {
    this.http.put(`${this._httpApiEndpoint}/lobby/member`, {
      quizName: this._hashtag,
      nickname: name,
      webSocketId: window.sessionStorage.getItem('webSocket')
    }).subscribe(
      (data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          window.sessionStorage.setItem(`${this._hashtag}_nick`, 'testnick');
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
            setTimeout(() => this.handleIncomingPlayers(), 1000);
            this.addTestPlayer('testnick');
            this.addTestPlayer('testnickerina');
          },
          (error) => {
            console.log('error', error);
          }
        );
      } else {
        this.headerLabelService.setHeaderLabel('component.lobby.waiting_for_players');
        setTimeout(() => this.handleIncomingPlayers(), 1000);
      }
    });
  }

  ngOnDestroy() {
  }

}
