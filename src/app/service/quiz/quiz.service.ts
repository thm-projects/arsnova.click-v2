import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DefaultSettings } from '../../lib/default.settings';
import { AbstractQuestionEntity } from '../../lib/entities/question/AbstractQuestionEntity';
import { SingleChoiceQuestionEntity } from '../../lib/entities/question/SingleChoiceQuestionEntity';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { StorageKey } from '../../lib/enums/enums';
import { QuizState } from '../../lib/enums/QuizState';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { NoDataErrorComponent } from '../../shared/no-data-error/no-data-error.component';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private _isAddingPoolQuestion = false;
  private _isOwner = false;
  private _quiz: QuizEntity;
  private _readingConfirmationRequested = false;
  private _isInEditMode = false;

  public playAudio = true;

  get isAddingPoolQuestion(): boolean {
    return this._isAddingPoolQuestion;
  }

  set isAddingPoolQuestion(value: boolean) {
    if (value && !this.quiz) {
      this._isInEditMode = true;
      this.generatePoolQuiz();
    }
    this._isAddingPoolQuestion = value;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  set isOwner(value: boolean) {
    this._isOwner = value;
  }

  get quiz(): QuizEntity {
    return this._quiz;
  }

  set quiz(value: QuizEntity) {
    if (value) {
      sessionStorage.setItem(StorageKey.CurrentQuizName, value.name);
      // noinspection SuspiciousInstanceOfGuard
      if (!(
        value instanceof QuizEntity
      )) {
        value = new QuizEntity(value);
      }
    }
    this._quiz = value;
    this.quizUpdateEmitter.next(value);
  }

  get readingConfirmationRequested(): boolean {
    return this._readingConfirmationRequested;
  }

  set readingConfirmationRequested(value: boolean) {
    this._readingConfirmationRequested = value;
  }

  get isInEditMode(): boolean {
    return this._isInEditMode;
  }

  public readonly quizUpdateEmitter: ReplaySubject<QuizEntity> = new ReplaySubject(1);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private quizApiService: QuizApiService,
    private ngbModal: NgbModal,
  ) {
  }

  public cleanUp(): Observable<void> {
    this._readingConfirmationRequested = false;
    this._isAddingPoolQuestion = false;
    this._isInEditMode = false;

    return this.close().pipe(tap(() => {
      this.quiz = null;
      this.isOwner = false;
    }));
  }

  public persist(): void {
    if (isPlatformServer(this.platformId) || this._isAddingPoolQuestion) {
      return;
    }

    this.storageService.db.Quiz.put(this.quiz);

    if (this._isInEditMode) {
      this.quizApiService.putSavedQuiz(this.quiz).subscribe();
      this.quizUpdateEmitter.next(this.quiz);
    }
  }

  public persistQuiz(quiz: QuizEntity): void {
    if (isPlatformServer(this.platformId) || this._isAddingPoolQuestion) {
      return;
    }

    if (this._isInEditMode) {
      this.saveParsedQuiz(quiz);
    }
  }

  public saveParsedQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.quizApiService.putSavedQuiz(quiz).pipe(tap(result => {
      this.storageService.db.Quiz.put(result.payload);
    }));
  }

  public currentQuestion(): AbstractQuestionEntity {
    if (!this.quiz) {
      return;
    }

    return this.quiz.questionList[this.quiz.currentQuestionIndex];
  }

  public close(): Observable<void> {
    if (isPlatformServer(this.platformId)) {
      return new Observable(subscriber => subscriber.next());
    }

    if (this.isOwner && this._quiz) {
      this._quiz.state = QuizState.Inactive;
      this.storageService.db.Quiz.get(this.quiz.name).then(quiz => {
        if (quiz) {
          quiz.state = QuizState.Inactive;
        }
        return this.storageService.db.Quiz.put(quiz);
      });
      return this.quizApiService.deleteActiveQuiz(this._quiz);
    }

    return new Observable(subscriber => subscriber.next());
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
      if (!quizName) {
        const instance = this.ngbModal.open(NoDataErrorComponent, {
          keyboard: false,
          backdrop: 'static',
        });
        instance.componentInstance.targetMessage = 'global.no-data-error.load-to-play';
        instance.result.catch(() => {});
        reject();
        return;
      }

      if (this.quiz) {
        console.log('QuizService: aborting loadDataToPlay since the quiz is already present', quizName);
        this._isInEditMode = false;
        resolve();
        return;
      }

      this.storageService.db.Quiz.get(quizName).then(quiz => {

        console.log('QuizService: loadDataToPlay finished', quizName);
        this._isInEditMode = false;
        this.isOwner = !!quiz;
        console.log('QuizService: isOwner', this.isOwner);
        this.restoreSettings(quizName).then(() => resolve());
      }).catch(() => reject());
    });
  }

  public loadDataToEdit(quizName: string, checkExisting = true): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!quizName) {
        const instance = this.ngbModal.open(NoDataErrorComponent, {
          keyboard: false,
          backdrop: 'static',
        });
        instance.componentInstance.target = ['/quiz/overview'];
        instance.componentInstance.targetMessage = 'global.no-data-error.load-to-edit';
        instance.componentInstance.targetButton = 'global.no-data-error.to-quiz-overview';
        instance.result.catch(() => {});
        reject();
        return;
      }
      if (checkExisting && this.quiz?.name === quizName) {
        this._isInEditMode = true;
        this._isOwner = true;
        this.quizUpdateEmitter.next(this.quiz);
        console.log('QuizService: loadDataToEdit already initialized', quizName);
        resolve();
        return;
      }

      this.storageService.db.Quiz.get(quizName).then(quiz => {
        if (!quiz) {
          reject();
          return;
        }

        this.isOwner = true;
        this._isInEditMode = true;
        this.quiz = new QuizEntity(quiz);
        console.log('QuizService: loadDataToEdit finished', quiz, quizName);
        resolve();
      });
    });
  }

  public stopEditMode(): void {
    this._isInEditMode = false;
    this._isAddingPoolQuestion = false;
  }

  public editPoolQuestion(): void {
    this._isInEditMode = true;
    this._isAddingPoolQuestion = true;
  }

  public generatePoolQuiz(questionList?: Array<AbstractQuestionEntity>): void {
    const defaultSettings = DefaultSettings.defaultQuizSettings;
    this.quiz = new QuizEntity({
      name: null,
      currentQuestionIndex: 0,
      questionList: questionList ?? [new SingleChoiceQuestionEntity({ answerOptionList: [] })],
      ...defaultSettings,
    });
  }

  public toggleAudioPlay(): void {
    this.playAudio = !this.playAudio;
  }

  private restoreSettings(quizName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.quizApiService.getQuiz(quizName).subscribe(response => {
        if (!response.payload.quiz) {
          reject();
          throw new Error(`No valid quiz found in quizStatus: ${JSON.stringify(response)}`);
        }

        this.quiz = response.payload.quiz;
        resolve();
      }, () => reject());
    });
  }
}
