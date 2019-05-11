import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultSettings } from '../../../lib/default.settings';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbTable, StorageKey } from '../../../lib/enums/enums';
import { StatusProtocol } from '../../../lib/enums/Message';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class QuizService {
  public readonly quizUpdateEmitter: EventEmitter<QuizEntity> = new EventEmitter(true);

  private _isOwner = false;

  get isOwner(): boolean {
    return this._isOwner;
  }

  set isOwner(value: boolean) {
    this._isOwner = value;
  }

  private _quiz: QuizEntity;

  get quiz(): QuizEntity {
    return this._quiz;
  }

  set quiz(value: QuizEntity) {
    if (value) {
      sessionStorage.setItem(StorageKey.CurrentQuizName, value.name);
      // noinspection SuspiciousInstanceOfGuard
      if (!(value instanceof QuizEntity)) {
        value = new QuizEntity(value);
      }
    }
    this._quiz = value;
    this.quizUpdateEmitter.emit(value);
  }

  private _readingConfirmationRequested = false;

  get readingConfirmationRequested(): boolean {
    return this._readingConfirmationRequested;
  }

  set readingConfirmationRequested(value: boolean) {
    this._readingConfirmationRequested = value;
  }

  private _isInEditMode = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private quizApiService: QuizApiService,
  ) {
  }

  public cleanUp(): void {
    this._readingConfirmationRequested = false;

    if (isPlatformBrowser(this.platformId)) {
      this.close();
      this.quiz = null;
      this.isOwner = false;
    }
  }

  public persist(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.create(DbTable.Quiz, this.quiz.name, this.quiz).subscribe();

      if (this._isInEditMode) {
        this.quizApiService.putSavedQuiz(this.quiz).subscribe();
      }
    }
  }

  public updateFooterElementsState(): void {
    if (this.quiz) {
      this.footerBarService.footerElemEnableCasLogin.isActive = this.quiz.sessionConfig.nicks.restrictToCasLogin;
      this.footerBarService.footerElemBlockRudeNicknames.isActive = this.quiz.sessionConfig.nicks.blockIllegalNicks;

      this.footerBarService.footerElemEnableCasLogin.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemEnableCasLogin.isActive;
        this.footerBarService.footerElemEnableCasLogin.isActive = newState;
        this.quiz.sessionConfig.nicks.restrictToCasLogin = newState;
        this.persist();
      };
      this.footerBarService.footerElemBlockRudeNicknames.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemBlockRudeNicknames.isActive;
        this.footerBarService.footerElemBlockRudeNicknames.isActive = newState;
        this.quiz.sessionConfig.nicks.blockIllegalNicks = newState;
        this.persist();
      };
    }
  }

  public currentQuestion(): AbstractQuestionEntity {
    if (!this.quiz) {
      return;
    }

    return this.quiz.questionList[this.quiz.currentQuestionIndex];
  }

  public close(): void {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    if (this.isOwner && this._quiz) {
      this.quizApiService.deleteActiveQuiz(this._quiz).subscribe();
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
      case this.footerBarService.footerElemReadingConfirmation:
        target = 'readingConfirmationEnabled';
        break;
    }
    if (target) {
      this._quiz.sessionConfig[target] = !elem.isActive;
      elem.isActive = !elem.isActive;
      this.toggleSettingByName(target, elem.isActive);
    }
  }

  public toggleSettingByName(target: string, state: boolean | string): void {
    this.quizApiService.postQuizSettingsUpdate(this.quiz, {
      target: target,
      state: state,
    }).subscribe(data => {
      if (data.status !== StatusProtocol.Success) {
        console.log('QuizService: PostQuizSettingsUpdate failed', data);
      }
    }, error => {
      console.log('QuizService: PostQuizSettingsUpdate failed', error);
    });
  }

  public isValid(): boolean {
    return this.quiz && this.quiz.isValid();
  }

  public getVisibleQuestions(maxIndex?: number): Array<AbstractQuestionEntity> {
    if (!this._quiz) {
      return [];
    }
    return this._quiz.questionList.slice(0, maxIndex || this.quiz.currentQuestionIndex + 1);
  }

  public hasSelectedNick(nickname: string): boolean {
    return this.quiz.sessionConfig.nicks.selectedNicks.indexOf(nickname) !== -1;
  }

  public toggleSelectedNick(nickname: string): void {
    if (this.hasSelectedNick(nickname)) {
      this.removeSelectedNickByName(nickname);
    } else {
      this.addSelectedNick(nickname);
    }
  }

  public addSelectedNick(newSelectedNick: string): void {
    if (this.hasSelectedNick(newSelectedNick)) {
      return;
    }
    this.quiz.sessionConfig.nicks.selectedNicks.push(newSelectedNick);
  }

  public removeSelectedNickByName(selectedNick: string): void {
    const index = this.quiz.sessionConfig.nicks.selectedNicks.indexOf(selectedNick);
    if (index === -1) {
      return;
    }
    this.quiz.sessionConfig.nicks.selectedNicks.splice(index, 1);
  }

  public loadDataToPlay(quizName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.quiz) {
        console.log('QuizService: aborting loadDataToPlay since the quiz is already present', quizName);
        this.quizUpdateEmitter.emit(this.quiz);
        resolve();
        return;
      }

      this.storageService.read(DbTable.Quiz, quizName).subscribe(quiz => {

        console.log('QuizService: loadDataToPlay finished', quiz, quizName);
        if (!quiz) {
          this.isOwner = false;
          this.restoreSettings(quizName).then(() => resolve());
          return;
        }

        this.isOwner = true;

        this.quizApiService.getQuiz(quizName).subscribe(response => {
          if (!response.payload.quiz) {
            reject();
            throw new Error(`No valid quiz found in quizStatus: ${JSON.stringify(response)}`);
          }

          this.quiz = response.payload.quiz;
          this.updateOwnerState();
          resolve();
        });
      });
    });
  }

  public loadDataToEdit(quizName: string): void {
    this.storageService.read(DbTable.Quiz, quizName).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this.quiz = new QuizEntity(quiz);
      this.isOwner = true;
      this.updateOwnerState();
      this._isInEditMode = true;
      console.log('QuizService: loadDataToEdit finished', quiz, quizName);
    });
  }

  public stopEditMode(): void {
    this._isInEditMode = false;
  }

  private restoreSettings(quizName: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.quizApiService.getQuiz(quizName).subscribe(response => {
        this.quiz = response.payload.quiz;
        resolve();
      });
    });
  }

  private updateOwnerState(): void {
    if (!this._isOwner || !this.quiz) {
      console.log('QuizService: Cannot update owner state.', this.isOwner, this.quiz);
      return;
    }

    this.footerBarService.footerElemReadingConfirmation.isActive = !!this.quiz.sessionConfig.readingConfirmationEnabled;
    this.footerBarService.footerElemConfidenceSlider.isActive = !!this.quiz.sessionConfig.confidenceSliderEnabled;

    if (isPlatformBrowser(this.platformId)) {
      this.footerBarService.footerElemExport.onClickCallback = async () => {
        const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this._quiz.name}/${sessionStorage.getItem(
          StorageKey.PrivateKey)}/${this._quiz.sessionConfig.theme}/${this.translateService.currentLang}`;
        window.open(link);
      };
    }

    this.updateFooterElementsState();
  }
}
