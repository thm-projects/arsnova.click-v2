import {Injectable} from '@angular/core';
import {DefaultSettings} from '../../lib/default.settings';
import {ITheme} from '../../lib/common.interfaces';
import {HttpClient} from '@angular/common/http';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {CurrentQuizService} from './current-quiz.service';
import {ConnectionService} from './connection.service';

@Injectable()
export class ThemesService {
  get currentTheme(): string {
    return this._currentTheme;
  }

  get themes(): Array<Object> {
    return this._themes;
  }

  private _themes: Array<ITheme> = [];
  private _currentTheme: string;

  constructor(
    private currentQuizService: CurrentQuizService,
    private connectionService: ConnectionService,
    private http: HttpClient) {
    if (!window.localStorage.getItem('config.default_theme')) {
      window.localStorage.setItem('config.default_theme', DefaultSettings.defaultSettings.theme);
    }
    this.updateCurrentlyUsedTheme();
    http.get(`${DefaultSettings.httpApiEndpoint}/themes`)
        .subscribe(
          (data: IMessage) => {
            this._themes = data.payload;
          },
          error => {
            console.log(error);
          }
        );

    this.connectionService.initConnection().then(() => {
      connectionService.socket.subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:UPDATED_SETTINGS') {
          this.currentQuizService.quiz.sessionConfig[data.payload.target] = data.payload.state;
          this.currentQuizService.persistToSessionStorage();
          if (data.payload.target === 'theme') {
            this.updateCurrentlyUsedTheme();
          }
        }
      });
    });
  }

  updateCurrentlyUsedTheme() {
    let usedTheme = (window.sessionStorage.getItem('config.quiz_theme') || window.localStorage.getItem('config.default_theme'));
    if (this.currentQuizService.quiz && this.currentQuizService.quiz.sessionConfig.theme) {
      usedTheme = this.currentQuizService.quiz.sessionConfig.theme;
    }
    if (document.getElementsByTagName('html').item(0).className) {
      document.getElementsByTagName('html').item(0).classList.remove(document.getElementsByTagName('html').item(0).className);
    }
    this._currentTheme = usedTheme;
    document.getElementsByTagName('html').item(0).className = usedTheme;
  }

}
