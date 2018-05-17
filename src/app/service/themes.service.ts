import {Injectable} from '@angular/core';
import {DefaultSettings} from '../../lib/default.settings';
import {ITheme, IMessage} from 'arsnova-click-v2-types/src/common';
import {HttpClient} from '@angular/common/http';
import {CurrentQuizService} from './current-quiz.service';
import {ConnectionService} from './connection.service';

@Injectable()
export class ThemesService {
  set themes(value: Array<ITheme>) {
    this._themes = value;
  }
  get currentTheme(): string {
    return this._currentTheme;
  }

  get themes(): Array<{id: string, name: string, description: string}> {
    return this._themes;
  }

  private _themes: Array<ITheme> = [];
  private _currentTheme: string;

  constructor(
    private currentQuizService: CurrentQuizService,
    private connectionService: ConnectionService,
    private http: HttpClient
  ) {
    if (!window.localStorage.getItem('config.default_theme')) {
      window.localStorage.setItem('config.default_theme', DefaultSettings.defaultQuizSettings.theme);
    }
    this.updateCurrentlyUsedTheme();
    http.get(`${DefaultSettings.httpApiEndpoint}/themes`)
        .subscribe(
          (data: IMessage) => {
            this.themes = data.payload;
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
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];
    if (themeDataset === usedTheme) {
      return;
    }
    this._currentTheme = usedTheme;

    document.getElementsByTagName('html').item(0).dataset['theme'] = usedTheme;

    this.reloadLinkNodes();
  }

  public reloadLinkNodes(target?): void {

    if (!target) {
      target = this._currentTheme;
    }

    this.http.get(`${DefaultSettings.httpLibEndpoint}/linkImages/${target}`).subscribe((data: Array<any>) => {
      data.forEach(elem => {

        const previousElement = document.getElementById(elem.id);
        if (previousElement) {
          if (elem.className) {
            previousElement.setAttribute('className', elem.className);
          }
          if (elem.type) {
            previousElement.setAttribute('type', elem.type);
          }
          if (elem.id) {
            previousElement.setAttribute('id', elem.id);
          }
          if (elem.rel) {
            previousElement.setAttribute('rel', elem.rel);
          }
          if (elem.href) {
            previousElement.setAttribute('href', elem.href);
          }
          if (elem.name) {
            previousElement.setAttribute('name', elem.name);
          }
          if (elem.content) {
            previousElement.setAttribute('content', elem.content);
          }
        } else {
          const child = document.createElement(elem.tagName);
          if (elem.className) {
            child.className = elem.className;
          }
          if (elem.type) {
            child.type = elem.type;
          }
          if (elem.id) {
            child.id = elem.id;
          }
          if (elem.rel) {
            child.rel = elem.rel;
          }
          if (elem.href) {
            child.href = elem.href;
          }
          if (elem.name) {
            child.name = elem.name;
          }
          if (elem.content) {
            child.content = elem.content;
          }
          document.head.appendChild(child);
        }
      });
    });
  }

}