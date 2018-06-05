import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IMessage, ITheme } from 'arsnova-click-v2-types/src/common';
import { Observable, of } from 'rxjs/index';
import { DefaultSettings } from '../../../lib/default.settings';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';

@Injectable()
export class ThemesService {
  private _themes: Array<ITheme> = [];

  get themes(): Array<{ id: string, name: string, description: string }> {
    return this._themes;
  }

  set themes(value: Array<ITheme>) {
    this._themes = value;
  }

  private _currentTheme: string;

  get currentTheme(): string {
    return this._currentTheme;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private currentQuizService: CurrentQuizService,
    private connectionService: ConnectionService,
    private http: HttpClient,
  ) {
    if (isPlatformBrowser(this.platformId) && !window.localStorage.getItem('config.default_theme')) {
      window.localStorage.setItem('config.default_theme', DefaultSettings.defaultQuizSettings.theme);
    }
    http.get(`${DefaultSettings.httpApiEndpoint}/themes`).subscribe(
      (data: IMessage) => {
        this.themes = data.payload;
      },
      error => {
        console.log(error);
      },
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

  public updateCurrentlyUsedTheme(): Observable<void> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }

    let usedTheme = (window.sessionStorage.getItem('config.quiz_theme') || window.localStorage.getItem('config.default_theme'));
    if (this.currentQuizService.quiz && this.currentQuizService.quiz.sessionConfig.theme) {
      usedTheme = this.currentQuizService.quiz.sessionConfig.theme;
    }
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    if (!document.getElementById('link-manifest') && themeDataset === usedTheme) {
      return this.reloadLinkNodes(usedTheme);
    }
    if (themeDataset !== usedTheme) {
      this._currentTheme = usedTheme;
      document.getElementsByTagName('html').item(0).dataset['theme'] = usedTheme;
      return this.reloadLinkNodes();
    }

    return of(null);
  }

  public reloadLinkNodes(target?): Observable<void> {
    if (isPlatformServer(this.platformId) || (!document.getElementById('link-manifest') && !target)) {
      return of(null);
    }

    if (!target) {
      target = this._currentTheme;
    }

    return new Observable<void>((subscriber) => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/linkImages/${target}`).subscribe((data: Array<any>) => {
        data.forEach((elem, index) => {
          const previousElement = document.getElementById(elem.id);
          if (previousElement) {
            this.replaceExistingNode(previousElement, elem);
          } else {
            this.addNewNode(elem);
          }
          if (index === data.length) {
            subscriber.next();
          }
        });
      });
    });
  }

  private addNewNode(elem): void {
    const child = document.createElement(elem.tagName);
    this.replaceExistingNode(child, elem);
    document.head.appendChild(child);
  }

  private replaceExistingNode(previousElement, elem): void {
    if (elem.className) {
      previousElement.setAttribute('class', elem.className);
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
  }

}
