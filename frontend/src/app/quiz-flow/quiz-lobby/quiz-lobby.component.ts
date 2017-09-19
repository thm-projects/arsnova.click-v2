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

export declare interface IPlayer {
  id: string;
  name: string;
  colorCode: string;
}

export declare interface IMessage extends Object {
  status: string;
  step: string;
  payload: any;
}

class Player implements IPlayer {
  get colorCode(): string {
    return this._colorCode;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  private _id: string;
  private _name: string;
  private _colorCode: string;

  constructor({id, name, colorCode}) {
    this._id = id;
    this._name = name;
    this._colorCode = colorCode;
  }
}

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss']
})
export class QuizLobbyComponent implements OnInit, OnDestroy {
  get players(): Array<IPlayer> {
    return this._players;
  }

  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}`;
  private _players: Array<IPlayer> = [];

  constructor(private footerBarService: FooterBarService,
              private headerLabelService: HeaderLabelService,
              private activeQuestionGroupService: ActiveQuestionGroupService,
              private themesService: ThemesService,
              private http: HttpClient,
              private connectionService: ConnectionService,
              private sanitizer: DomSanitizer) {
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
    headerLabelService.setHeaderLabel('component.lobby.title');
  }

  private handleIncomingPlayers() {
    this.connectionService.socket.next({
      step: 'LOBBY:GET_PLAYERS'
    });
    this.connectionService.socket.subscribe((message) => {
      const data = JSON.parse(message.data);
      if (data.step === 'LOBBY:ALL_PLAYERS') {
        data.payload.members.forEach((elem: IPlayer) => {
          this._players.push(new Player(elem));
        });
        console.log(data.payload);
      }
    });
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }

  addTestPlayer() {
    this.http.put(`${this._httpApiEndpoint}/lobby/member`, {
      quizName: this.activeQuestionGroupService.activeQuestionGroup.hashtag,
      nickname: 'testnick',
      webSocketId: window.sessionStorage.getItem('webSocket')
    }).subscribe(
      (data: IMessage) => {
        console.log(data);
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'LOBBY:MEMBER_ADDED') {
          this._players.push(data.payload.member);
        }
      }
    );
  }

  ngOnInit() {
    this.themesService.updateCurrentlyUsedTheme();
    this.connectionService.initConnection().then(() => {
      this.http.put(`${this._httpApiEndpoint}/lobby`, {
        quiz: this.activeQuestionGroupService.activeQuestionGroup.serialize()
      }).subscribe(
        () => {
          this.headerLabelService.setHeaderLabel('component.lobby.waiting_for_players');
          this.handleIncomingPlayers();
          this.addTestPlayer();
        },
        (error) => {
          console.log('error', error);
        }
      );
    });
  }

  ngOnDestroy() {
  }

}
