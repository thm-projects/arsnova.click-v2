import {Injectable} from '@angular/core';
import {IQuestion, IQuestionGroup} from '../../lib/questions/interfaces';
import {ConnectionService} from './connection.service';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {questionGroupReflection} from '../../lib/questions/questionGroup_reflection';
import {DefaultSettings} from '../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {FooterbarElement, FooterBarService} from './footer-bar.service';
import {SettingsService} from './settings.service';

export declare interface ICurrentQuizData {
  quiz: IQuestionGroup;
  questionIndex: number;
  readingConfirmationRequested: boolean;
}

export declare interface ICurrentQuiz extends ICurrentQuizData {
  serialize(): ICurrentQuizData;
}

@Injectable()
export class CurrentQuizService implements ICurrentQuiz {
  set readingConfirmationRequested(value: boolean) {
    this._readingConfirmationRequested = value;
    this.persistToSessionStorage();
  }

  get readingConfirmationRequested(): boolean {
    return this._readingConfirmationRequested;
  }

  set questionIndex(value: number) {
    this._questionIndex = value;
    this.persistToSessionStorage();
  }

  get questionIndex(): number {
    return this._questionIndex;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get quiz(): IQuestionGroup {
    return this._quiz;
  }

  set quiz(value: IQuestionGroup) {
    this._quiz = value;
    if (value) {
      this._isOwner = (JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || []).indexOf(value.hashtag) > -1;

      new Promise((resolve => {
        if (this._isOwner) {
          if (this._cacheAssets || this.settingsService.serverSettings.cacheQuizAssets || DefaultSettings.defaultSettings.cacheQuizAssets) {
            this.http.post(`${DefaultSettings.httpLibEndpoint}/cache/quiz/assets`, {
              quiz: this._quiz.serialize()
            }).subscribe((response: IMessage) => {
              if (response.status !== 'STATUS:SUCCESSFUL') {
                console.log(response);
              } else {
                console.log('persisting quiz as owner with caching');
                resolve();
              }
            });
          } else {
            console.log('persisting quiz as owner without caching');
            resolve();
          }
        } else {
          console.log('persisting quiz as attendee');
          resolve();
        }
      })).then(() => this.persistToSessionStorage());
    }
  }

  private _isOwner = false;
  private _quiz: IQuestionGroup;
  private _questionIndex = 0;
  private _readingConfirmationRequested = false;
  private _cacheAssets = false;

  constructor(
    private http: HttpClient,
    private footerBarService: FooterBarService,
    private settingsService: SettingsService,
    private connectionService: ConnectionService) {
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
        if (this._quiz.sessionConfig.readingConfirmationEnabled) {
          this.footerBarService.footerElemReadingConfirmation.isActive = true;
        }
        if (this._quiz.sessionConfig.showResponseProgress) {
          this.footerBarService.footerElemResponseProgress.isActive = true;
        }
        if (this._quiz.sessionConfig.confidenceSliderEnabled) {
          this.footerBarService.footerElemConfidenceSlider.isActive = true;
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

  public currentQuestion(): IQuestion {
    return this._quiz.questionList[this._questionIndex];
  }

  public cleanUp(): void {
    this.close();
    const nickname = window.sessionStorage.getItem(`config.nick`);
    if (nickname) {
      const url = `${DefaultSettings.httpApiEndpoint}/member/${this._quiz.hashtag}/${nickname}`;
      this.http.request('delete', url).subscribe(() => {});
    }
    window.sessionStorage.removeItem(`config.nick`);
    window.sessionStorage.removeItem(`config.current_quiz`);
    this._isOwner = false;
    this._quiz = null;
    this._questionIndex = 0;
    this._readingConfirmationRequested = false;
  }

  public close(): void {
    if (this._isOwner && this._quiz) {
      this.http.request('delete', `${DefaultSettings.httpApiEndpoint}/quiz/active`, {
        body: {
          quizName: this._quiz.hashtag,
          privateKey: window.localStorage.getItem('config.private_key')
        }
      }).subscribe((response: IMessage) => {
        if (response.status !== 'STATUS:SUCCESS') {
          console.log(response);
        }
      });
    }
  }

  public toggleSetting(elem: FooterbarElement) {
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
      this.toggleSettingByName(target, elem.isActive);
    }
  }

  public toggleSettingByName(target: string, state: boolean | string): void {
    this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/settings/update`, {
      quizName: this._quiz.hashtag,
      target: target,
      state: state
    }).subscribe(
      (data: IMessage) => {
        if (data.status !== 'STATUS:SUCCESSFUL') {
          console.log(data);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public serialize(): ICurrentQuizData {
    return {
      quiz: this._quiz ? this._quiz.serialize() : null,
      questionIndex: this._questionIndex,
      readingConfirmationRequested: this._readingConfirmationRequested
    };
  }

  public getVisibleQuestions(maxIndex?: number): Array<IQuestion> {
    return this._quiz.questionList.slice(0, maxIndex || this._questionIndex + 1);
  }

  public persistToSessionStorage(): void {
    window.sessionStorage.setItem('config.current_quiz', JSON.stringify(this.serialize()));
  }

}
