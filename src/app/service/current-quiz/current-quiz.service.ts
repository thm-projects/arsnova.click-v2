import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICurrentQuiz, ICurrentQuizData, IMessage } from 'arsnova-click-v2-types/src/common';
import { IQuestion, IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionGroupReflection } from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { MemberApiService } from '../api/member/member-api.service';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class CurrentQuizService implements ICurrentQuiz {

  private _isOwner = false;

  get isOwner(): Observable<boolean> {
    if (!this._quiz) {
      return new Observable<boolean>(subscriber => subscriber.next(false));
    }

    return this.storageService.read(DB_TABLE.QUIZ, this._quiz.hashtag);
  }

  private _quiz: IQuestionGroup;

  get quiz(): IQuestionGroup {
    return this._quiz;
  }

  set quiz(value: IQuestionGroup) {
    this._quiz = value;
    this.isOwner.subscribe(val => {
      if (val) {
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
          this.footerBarService.footerElemExport.onClickCallback = async () => {
            const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this._quiz.hashtag}/${await this.storageService.read(DB_TABLE.CONFIG,
              STORAGE_KEY.PRIVATE_KEY).toPromise()}/${this._quiz.sessionConfig.theme}/${this.translateService.currentLang}`;
            window.open(link);
          };
        }
      }
    });
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
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private settingsService: SettingsService,
    private connectionService: ConnectionService,
    private quizApiService: QuizApiService,
    private memberApiService: MemberApiService,
    private storageService: StorageService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.CURRENT_QUIZ).subscribe(val => {
        if (val) {
          if (val.questionIndex) {
            this._questionIndex = val.questionIndex;
          }
          if (val.readingConfirmationRequested) {
            this._readingConfirmationRequested = val.readingConfirmationRequested;
          }
          if (val.quiz) {
            this.quiz = questionGroupReflection[val.quiz.TYPE](val.quiz);
          }
        }
      });
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
      const ownsQuiz = await this.isOwner;

      if (ownsQuiz) {
        if (this.settingsService.serverSettings.cacheQuizAssets) {

          const response = await this.quizApiService.postCacheQuizAssets({
            quiz: this._quiz.serialize(),
          }).toPromise();

          if (response.status !== 'STATUS:SUCCESSFUL') {
            console.log(response);
          } else {
            console.log('loading quiz as owner with caching');
          }

        } else {
          console.log('loading quiz as owner without caching');
        }
      } else {
        console.log('loading quiz as attendee');
      }

      this.persistToSessionStorage();
      resolve();
    });
  }

  public currentQuestion(): IQuestion {
    return this._quiz.questionList[this._questionIndex];
  }

  public cleanUp(): Promise<any> {
    return new Promise((
      async resolve => {
        await this.close();
        if (isPlatformBrowser(this.platformId)) {
          const nickname = await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.NICK).toPromise();
          if (nickname) {
            await this.memberApiService.deleteMember(this._quiz.hashtag, nickname);
          }
          this.storageService.delete(DB_TABLE.CONFIG, STORAGE_KEY.MEMBER_GROUP).subscribe();
          this.storageService.delete(DB_TABLE.CONFIG, STORAGE_KEY.NICK).subscribe();
          this.storageService.delete(DB_TABLE.CONFIG, STORAGE_KEY.CURRENT_QUIZ).subscribe();
        }
        this._quiz = null;
        this._questionIndex = 0;
        this._readingConfirmationRequested = false;
        resolve();
      }
    ));
  }

  public async close(): Promise<any> {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    const ownsQuiz = await this.isOwner;

    if (ownsQuiz && this._quiz) {
      const response = await this.quizApiService.deactivateQuizAsOwner({
        body: {
          quizName: this._quiz.hashtag,
          privateKey: await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise(),
        },
      }).toPromise();

      if (response.status !== 'STATUS:SUCCESSFUL') {
        console.log(response);
      }
    }
  }

  public toggleSetting(elem: IFooterBarElement): void {
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
    this.quizApiService.postQuizSettingsUpdate({
      quizName: this._quiz.hashtag,
      target: target,
      state: state,
    }).subscribe(data => {
      if (data.status !== 'STATUS:SUCCESSFUL') {
        console.log(data);
      }
    }, error => {
      console.log(error);
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
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.CURRENT_QUIZ, this.serialize()).subscribe();
    }
  }

}
