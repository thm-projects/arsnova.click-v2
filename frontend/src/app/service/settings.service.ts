import {HostListener, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export const DefaultSettings = {
  httpApiEndpoint: `https://${location.hostname}:3000/api/v1`,
  httpLibEndpoint: `https://${location.hostname}:3000/lib`,
  wsApiEndpoint: `wss://${location.hostname}:3000`,
  defaultSettings: {
    answers: {
      displayAnswerTextOnButtons: true,
      answerText: '',
      isCorrect: true,
      configCaseSensitive: false,
      configTrimWhitespaces: false,
      configUseKeywords: false,
      configUsePunctuation: false
    },
    question: {
      showOneAnswerPerRow: true,
      text: '',
      timer: 0,
      multipleSurveySelectionEnabled: true,
      rangeMin: 0,
      rangeMax: 60,
      correctValue: 30
    },
    music: {
      enabled: {
        lobby: true,
        countdownRunning: true,
        countdownEnd: true
      },
      volume: {
        global: 60,
        lobby: 60,
        countdownRunning: 60,
        countdownEnd: 60,
        useGlobal: true
      },
      title: {
        lobby: 'Song0',
        countdownRunning: 'Song0',
        countdownEnd: 'Song0'
      },
      availableTitles: {
        basePath: 'public/songs',
        lobby: ['Song0', 'Song1', 'Song2', 'Song3'],
        countdownRunning: ['Song0', 'Song1', 'Song2'],
        countdownEnd: ['Song0', 'Song1']
      }
    },
    nicks: {
      blockIllegalNicks: true,
      restrictToCasLogin: false
    },
    theme: 'theme-Material',
    readingConfirmationEnabled: true,
    showResponseProgress: true,
    confidenceSliderEnabled: true,
    cacheQuizAssets: false
  }
};

export declare interface IServerSettings {
  cacheQuizAssets: boolean;
  createQuizPasswordRequired: boolean;
  limitActiveQuizzes: number;
}

@Injectable()
export class SettingsService implements OnDestroy {
  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  private _serverSettings: IServerSettings;

  constructor(
    private http: HttpClient
  ) {
    this._serverSettings = <IServerSettings>(JSON.parse(window.sessionStorage.getItem('_serverSettings')));
    if (!this._serverSettings) {
      this.initServerSettings();
    }
  }

  private initServerSettings() {
    this.http.get(`${DefaultSettings.httpApiEndpoint}/`).subscribe((data: any) => {
      this._serverSettings = data.serverConfig;
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  ngOnDestroy() {
    window.sessionStorage.setItem('_serverSettings', JSON.stringify(this._serverSettings));
  }
}
