import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { themes } from '../../../lib/available-themes';
import { DbState, DbTable, StorageKey } from '../../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { QuizTheme } from '../../../lib/enums/QuizTheme';
import { ITheme } from '../../../lib/interfaces/ITheme';
import { ThemesApiService } from '../api/themes/themes-api.service';
import { ConnectionService } from '../connection/connection.service';
import { I18nService } from '../i18n/i18n.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ThemesService {
  public readonly themeChanged: EventEmitter<QuizTheme> = new EventEmitter<QuizTheme>();

  private _currentTheme: QuizTheme;
  get themes(): Array<ITheme> {
    return this._themes;
  }

  get currentTheme(): QuizTheme {
    return this._currentTheme;
  }

  get defaultTheme(): QuizTheme {
    return this._defaultTheme;
  }

  private _themes: Array<ITheme> = environment.availableQuizThemes.map(t => themes.find(theme => theme.id === t));
  private readonly _defaultTheme: QuizTheme;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private quizService: QuizService,
    private connectionService: ConnectionService,
    private themesApiService: ThemesApiService,
    private storageService: StorageService,
    private i18nService: I18nService,
  ) {
    this._defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? QuizTheme.Blackbeauty : environment.availableQuizThemes[0];

    this.storageService.stateNotifier.subscribe(val => {
      if (val === DbState.Initialized) {
        this.initTheme();
      }
    });
  }

  public async updateCurrentlyUsedTheme(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const themePromises: Array<Promise<any>> = [];
    if (!environment.forceQuizTheme || !this.quizService.quiz) {
      themePromises.push(this.storageService.read(DbTable.Config, StorageKey.DefaultTheme).toPromise(),
        this.storageService.read(DbTable.Config, StorageKey.QuizTheme).toPromise());
    }
    themePromises.push(new Promise(resolve => {
      if (this.quizService.quiz && this.quizService.quiz.sessionConfig.theme) {
        resolve(this.quizService.quiz.sessionConfig.theme);
        return;
      }
      resolve(this._defaultTheme);
    }));

    const themeConfig = await Promise.all(themePromises);
    let usedTheme = themeConfig[0] || themeConfig[1] || themeConfig[2];
    if (usedTheme === 'default') {
      usedTheme = environment.availableQuizThemes[0];
    }
    const themeDataset = document.getElementsByTagName('html').item(0).dataset['theme'];

    if (!document.getElementById('link-manifest') && themeDataset === usedTheme) {
      this.reloadLinkNodes(usedTheme);
    }
    if (themeDataset !== usedTheme) {
      this._currentTheme = usedTheme;
      this.themeChanged.emit(this._currentTheme);
      document.getElementsByTagName('html').item(0).dataset['theme'] = usedTheme;
      this.reloadLinkNodes(usedTheme);
    }
  }

  public reloadLinkNodes(theme?): void {
    if (isPlatformServer(this.platformId) || (!document.getElementById('link-manifest') && !theme)) {
      return;
    }

    if (!theme) {
      theme = this._currentTheme;
    }

    this.themeChanged.emit(theme);

    this.themesApiService.getLinkImages(theme).subscribe(data => {
      data.forEach((elem) => {
        if (elem.id === 'link-manifest') {
          elem.href = elem.href.replace('%%LANG%%', this.i18nService.currentLanguage.toLowerCase());
        }
        const previousElement = document.getElementById(elem.id);
        if (previousElement) {
          this.replaceExistingNode(previousElement, elem);
        } else {
          this.addNewNode(elem);
        }
      });
    });
  }

  private initTheme(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.storageService.read(DbTable.Config, StorageKey.DefaultTheme).subscribe(val => {
        if (!val || val.startsWith('theme-')) {
          this.storageService.create(DbTable.Config, StorageKey.DefaultTheme, this._defaultTheme).subscribe();
        }
      });
    }

    this.connectionService.dataEmitter.subscribe(data => {
      if (data.status === StatusProtocol.Success && data.step === MessageProtocol.UpdatedSettings) {
        this.quizService.quiz.sessionConfig[data.payload.target] = data.payload.state;
        if (data.payload.target === 'theme') {
          this.updateCurrentlyUsedTheme();
        }
      }
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
