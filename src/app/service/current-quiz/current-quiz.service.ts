import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICurrentQuiz, ICurrentQuizData, IMessage } from 'arsnova-click-v2-types/src/common';
import { IQuestion, IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class CurrentQuizService implements ICurrentQuiz {

  private _isOwner = false;

  get isOwner(): boolean {
    return this._isOwner;
  }

  set isOwner(value: boolean) {
    this._isOwner = value;
    if (value) {
      if (this.quiz.sessionConfig.readingConfirmationEnabled) {
        this.footerBarService.footerElemReadingConfirmation.isActive = true;
      }
      if (this.quiz.sessionConfig.showResponseProgress) {
        this.footerBarService.footerElemResponseProgress.isActive = true;
      }
      if (this.quiz.sessionConfig.confidenceSliderEnabled) {
        this.footerBarService.footerElemConfidenceSlider.isActive = true;
      }
      if (isPlatformBrowser(this.platformId)) {
        this.footerBarService.footerElemExport.onClickCallback = () => {
          const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this._quiz.hashtag}/${window.localStorage.getItem(
            'config.private_key')}/${this._quiz.sessionConfig.theme}/${this.translateService.currentLang}`;
          window.open(link);
        };
      }
    }
  }

  private _quiz: IQuestionGroup;

  get quiz(): IQuestionGroup {
    return this._quiz;
  }

  set quiz(value: IQuestionGroup) {
    this._quiz = value;
    if (isPlatformBrowser(this.platformId) && value) {
      this.isOwner = (JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || []).indexOf(value.hashtag) > -1;
    }
  }

  private _questionIndex = 0;

  get questionIndex(): number {
    return this._questionIndex;
  }

  set questionIndex(value: number) {
    this._questionIndex = value;
    this.persistToSessionStorage();
  }

  private _readingConfirmationRequested = false;

  get readingConfirmationRequested(): boolean {
    return this._readingConfirmationRequested;
  }

  set readingConfirmationRequested(value: boolean) {
    this._readingConfirmationRequested = value;
    this.persistToSessionStorage();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private settingsService: SettingsService,
    private connectionService: ConnectionService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const instance = window.sessionStorage.getItem('config.current_quiz');
      if (instance) {
        const parsedInstance = JSON.parse(instance);
        if (parsedInstance.questionIndex) {
          this._questionIndex = parsedInstance.questionIndex;
        }
        if (parsedInstance.readingConfirmationRequested) {
          this._readingConfirmationRequested = parsedInstance.readingConfirmationRequested;
        }
        if (parsedInstance.quiz) {
          this.quiz = questionGroupReflection[parsedInstance.quiz.TYPE](parsedInstance.quiz);
        }
      }
    }
    this.connectionService.initConnection().then(() => {
      connectionService.socket.subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL' && data.step === 'QUIZ:UPDATED_SETTINGS') {
          this._quiz.sessionConfig[data.payload.target] = data.payload.state;
          this.persistToSessionStorage();
        }
      });
    });
  }

  public cacheQuiz(): Promise<any> {
    return new Promise(async (resolve) => {
      await new Promise((resolve2 => {
        if (this._isOwner) {
          if (this.settingsService.serverSettings.cacheQuizAssets) {

            this.http.post(`${DefaultSettings.httpLibEndpoint}/cache/quiz/assets`, {
              quiz: this._quiz.serialize(),
            }).subscribe((response: IMessage) => {

              if (response.status !== 'STATUS:SUCCESSFUL') {
                console.log(response);
              } else {
                console.log('loading quiz as owner with caching');
                resolve2();
              }

            });

          } else {
            console.log('loading quiz as owner without caching');
            resolve2();
          }
        } else {
          console.log('loading quiz as attendee');
          resolve2();
        }
      }));

      this.persistToSessionStorage();
      resolve();
    });
  }

  public currentQuestion(): IQuestion {
    return this._quiz.questionList[this._questionIndex];
  }

  public cleanUp(): Promise<any> {
    return new Promise((async resolve => {
      await this.close();
      if (isPlatformBrowser(this.platformId)) {
        const nickname = window.sessionStorage.getItem(`config.nick`);
        if (nickname) {
          const url = `${DefaultSettings.httpApiEndpoint}/member/${this._quiz.hashtag}/${nickname}`;
          await this.http.request('delete', url).subscribe(() => {});
        }
        window.sessionStorage.removeItem(`config.memberGroup`);
        window.sessionStorage.removeItem(`config.nick`);
        window.sessionStorage.removeItem(`config.current_quiz`);
      }
      this._isOwner = false;
      this._quiz = null;
      this._questionIndex = 0;
      this._readingConfirmationRequested = false;
      resolve();
    }));
  }

  public close(): Promise<any> {
    return new Promise((resolve => {
      if (isPlatformBrowser(this.platformId) && this._isOwner && this._quiz) {
        this.http.request('delete', `${DefaultSettings.httpApiEndpoint}/quiz/active`, {
          body: {
            quizName: this._quiz.hashtag,
            privateKey: window.localStorage.getItem('config.private_key'),
          },
        }).subscribe((response: IMessage) => {
          if (response.status !== 'STATUS:SUCCESSFUL') {
            console.log(response);
          }
          resolve();
        });
      } else {
        resolve();
      }
    }));
  }

  public toggleSetting(elem: IFooterBarElement): Observable<void> {
    let target: string = null;
    switch (elem) {
      case this.footerBarService.footerElemResponseProgress:
        target = 'showResponseProgress';
        break;
      case this.footerBarService.footerElemConfidenceSlider:
        target = 'confidenceSliderEnabled';
        break;
      case this.footerBarService.footerElemProductTour:
        target = null;
        break;
      case this.footerBarService.footerElemReadingConfirmation:
        target = 'readingConfirmationEnabled';
        break;
    }
    if (target) {
      this._quiz.sessionConfig[target] = !elem.isActive;
      elem.isActive = !elem.isActive;
      this.persistToSessionStorage();
      return this.toggleSettingByName(target, elem.isActive);
    }
  }

  public toggleSettingByName(target: string, state: boolean | string): Observable<void> {
    return new Observable<void>(subscriber => {
      (async () => {
        this.http.post<IMessage>(`${DefaultSettings.httpApiEndpoint}/quiz/settings/update`, {
          quizName: this._quiz.hashtag,
          target: target,
          state: state,
        }).subscribe(
          (data) => {
            if (data.status !== 'STATUS:SUCCESSFUL') {
              console.log(data);
            }
          },
          error => {
            console.log(error);
          },
        );
      })().then(() => subscriber.next());
    });
  }

  public serialize(): ICurrentQuizData {
    return {
      quiz: this._quiz ? this._quiz.serialize() : null,
      questionIndex: this._questionIndex,
      readingConfirmationRequested: this._readingConfirmationRequested,
    };
  }

  public getVisibleQuestions(maxIndex?: number): Array<IQuestion> {
    return this._quiz.questionList.slice(0, maxIndex || this._questionIndex + 1);
  }

  public persistToSessionStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('config.current_quiz', JSON.stringify(this.serialize()));
    }
  }

}
