import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { EventEmitter, Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { themes } from '../../lib/available-themes';
import { StorageKey } from '../../lib/enums/enums';
import { MessageProtocol, StatusProtocol } from '../../lib/enums/Message';
import { QuizTheme } from '../../lib/enums/QuizTheme';
import { THEME_MAP } from '../../lib/injection-token/theme-map';
import { ITheme, IThemeHashMap } from '../../lib/interfaces/ITheme';
import { ThemesApiService } from '../api/themes/themes-api.service';
import { ConnectionService } from '../connection/connection.service';
import { I18nService } from '../i18n/i18n.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  private _currentTheme: QuizTheme;
  private _themes: Array<ITheme> = environment.availableQuizThemes.map(t => themes.find(theme => theme.id === t));
  private readonly _defaultTheme: QuizTheme;

  public readonly themeChanged: EventEmitter<QuizTheme> = new EventEmitter<QuizTheme>();
  public themeHashes: Array<IThemeHashMap>;

  get currentTheme(): QuizTheme {
    return this._currentTheme;
  }

  get defaultTheme(): QuizTheme {
    return this._defaultTheme;
  }

  get themes(): Array<ITheme> {
    return this._themes;
  }

  constructor(
    @Optional() @Inject(THEME_MAP) private themeMap: Array<IThemeHashMap>, //
    @Inject(PLATFORM_ID) private platformId: Object,
    private quizService: QuizService,
    private connectionService: ConnectionService,
    private themesApiService: ThemesApiService,
    private storageService: StorageService,
    private i18nService: I18nService,
    private transferState: TransferState,
  ) {
    const key: StateKey<Array<IThemeHashMap>> = makeStateKey<Array<IThemeHashMap>>('transfer-theme-map');
    if (this.themeMap) {
      this.transferState.set(key, this.themeMap);
    } else {
      this.themeHashes = this.transferState.get<Array<IThemeHashMap>>(key, null);
      console.log('ThemesService: Transferred state and loaded themeHashes', this.themeHashes);
    }

    this._defaultTheme = isPlatformServer(this.platformId) ? environment.defaultTheme : //
                         environment.darkModeCheckEnabled && //
                         window.matchMedia('(prefers-color-scheme: dark)').matches ? //
                         QuizTheme.Blackbeauty : environment.defaultTheme;
  }

  public async updateCurrentlyUsedTheme(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const themePromises: Array<Promise<any>> = [];
    if (!environment.forceQuizTheme || !this.quizService.quiz) {
      themePromises.push(this.storageService.db.Config.get(StorageKey.DefaultTheme), this.storageService.db.Config.get(StorageKey.QuizTheme));
    }
    themePromises.push(new Promise(resolve => {
      if (this.quizService.quiz && this.quizService.quiz.sessionConfig.theme) {
        resolve(this.quizService.quiz.sessionConfig.theme);
        return;
      }
      resolve(this._defaultTheme);
    }));

    const themeConfig = await Promise.all(themePromises);
    let usedTheme = themeConfig[0] ? themeConfig[0].value : themeConfig[1] ? themeConfig[1].value : themeConfig[2];
    if (usedTheme === 'default' || !Object.values(environment.availableQuizThemes).includes(usedTheme)) {
      usedTheme = environment.defaultTheme;
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

    console.log('ThemesService: Reloading link nodes');

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
    }, () => {});
  }

  public initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.storageService.db.Config.get(StorageKey.DefaultTheme).then(val => {
      if (!val || val.value.startsWith('theme-')) {
        this.storageService.db.Config.put({
          value: this.defaultTheme,
          type: StorageKey.DefaultTheme,
        });
      }
    });

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
