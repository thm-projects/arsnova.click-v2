import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ITheme } from 'arsnova-click-v2-types/src/common';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { DefaultSettings } from '../../../lib/default.settings';
import { themes } from '../../shared/availableThemes';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { ThemesApiService } from '../api/themes/themes-api.service';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ThemesService {
  private _themes: Array<ITheme> = themes;

  get themes(): Array<ITheme> {
    return this._themes;
  }

  private _currentTheme: string;

  get currentTheme(): string {
    return this._currentTheme;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private currentQuizService: CurrentQuizService,
    private connectionService: ConnectionService,
    private themesApiService: ThemesApiService,
    private storageService: StorageService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.DEFAULT_THEME).subscribe(val => {
        if (!val) {
          this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.DEFAULT_THEME, DefaultSettings.defaultQuizSettings.theme).subscribe();
        }
      });
    }

    this.connectionService.initConnection().then(() => {
      if (!this.connectionService.socket) {
        return;
      }

      this.connectionService.socket.subscribe(data => {
        if (data.status === COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL && data.step === COMMUNICATION_PROTOCOL.QUIZ.UPDATED_SETTINGS) {
          this.currentQuizService.quiz.sessionConfig[data.payload.target] = data.payload.state;
          this.currentQuizService.persistToSessionStorage();
          if (data.payload.target === 'theme') {
            this.updateCurrentlyUsedTheme();
          }
        }
      });
    });
  }

  public async updateCurrentlyUsedTheme(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const themeConfig = await Promise.all([
      this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.DEFAULT_THEME).toPromise(),
      this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.QUIZ_THEME).toPromise(),
      new Promise(resolve => {
        if (this.currentQuizService.quiz && this.currentQuizService.quiz.sessionConfig.theme) {
          resolve(this.currentQuizService.quiz.sessionConfig.theme);
          return;
        }
        resolve();
      }),
    ]);
    const usedTheme = themeConfig[0] || themeConfig[1] || themeConfig[2];
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    if (!document.getElementById('link-manifest') && themeDataset === usedTheme) {
      this.reloadLinkNodes(usedTheme);
    }
    if (themeDataset !== usedTheme) {
      this._currentTheme = usedTheme;
      document.getElementsByTagName('html').item(0).dataset['theme'] = usedTheme;
      this.reloadLinkNodes();
    }
  }

  public reloadLinkNodes(theme?): void {
    if (isPlatformServer(this.platformId) || (
      !document.getElementById('link-manifest') && !theme
    )) {
      return;
    }

    if (!theme) {
      theme = this._currentTheme;
    }

    this.themesApiService.getLinkImages(theme).subscribe(data => {
      data.forEach((elem) => {
        const previousElement = document.getElementById(elem.id);
        if (previousElement) {
          this.replaceExistingNode(previousElement, elem);
        } else {
          this.addNewNode(elem);
        }
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
