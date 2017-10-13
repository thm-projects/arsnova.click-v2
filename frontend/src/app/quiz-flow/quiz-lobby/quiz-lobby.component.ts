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

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private themesService: ThemesService,
    private http: HttpClient,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private attendeeService: AttendeeService) {
    if (this.activeQuestionGroupService.activeQuestionGroup) {
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
      FooterBarComponent.footerElemStartQuiz.linkTarget = (self) => {
        return self.isActive ? '/quiz-results' : null;
      };
    } else {
      footerBarService.replaceFooterElments([
                                              FooterBarComponent.footerElemBack
                                            ]);
      this._isOwner = false;
    }
    headerLabelService.setHeaderLabel('component.lobby.title');
  }

  private handleIncomingPlayers() {
    this.connectionService.socket.next({
                                         step: 'LOBBY:GET_PLAYERS'
                                       });
    this.connectionService.socket.subscribe((message) => {
      const data = message;
      switch (data.step) {
        case 'LOBBY:INACTIVE':
          setTimeout(this.handleIncomingPlayers, 500);
          break;
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
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
          break;
      }
    });
  }

  isOwnNick(name: string): boolean {
    return name === window.sessionStorage.getItem(`${this.activeQuestionGroupService.activeQuestionGroup.hashtag}_nick`);
  }

  kickMember(name: string): void {
    const quizName = this.activeQuestionGroupService.activeQuestionGroup.hashtag;
    this.http.delete(`${this._httpApiEndpoint}/lobby/${quizName}/member/${name}`)
        .subscribe(
          (data: IMessage) => {
            console.log(data);
            if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_REMOVED') {
              this.attendeeService.attendees = this.attendeeService.attendees.filter(player => player.name !== name);
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

  addTestPlayer() {
    this.http.put(`${this._httpApiEndpoint}/lobby/member`, {
      quizName: this.activeQuestionGroupService.activeQuestionGroup.hashtag,
      nickname: 'testnick',
      webSocketId: window.sessionStorage.getItem('webSocket')
    }).subscribe(
      (data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          window.sessionStorage.setItem(`${this.activeQuestionGroupService.activeQuestionGroup.hashtag}_nick`, 'testnick');
        }
      }
    );
  }

  ngOnInit() {
    this.themesService.updateCurrentlyUsedTheme();
    this.connectionService.initConnection().then(() => {
      if (this.activeQuestionGroupService.activeQuestionGroup) {
        this.http.put(`${this._httpApiEndpoint}/lobby`, {
          quiz: this.activeQuestionGroupService.activeQuestionGroup.serialize()
        }).subscribe(
          () => {
            this.headerLabelService.setHeaderLabel('component.lobby.waiting_for_players');
            setTimeout(() => this.handleIncomingPlayers(), 1000);
            this.addTestPlayer();
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
