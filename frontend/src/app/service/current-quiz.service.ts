import {Injectable, OnDestroy} from '@angular/core';
import {IQuestion} from '../../lib/questions/interfaces';
import {questionReflection} from '../../lib/questions/question_reflection';
import {ISessionConfiguration} from '../../lib/session_configuration/interfaces';
import {SessionConfiguration} from '../../lib/session_configuration/session_config';
import {ThemesService} from './themes.service';

export declare interface ICurrentQuizData {
  hashtag: string;
  currentQuestion: IQuestion;
  previousQuestions: Array<IQuestion>;
  sessionConfiguration: ISessionConfiguration;
}

export declare interface ICurrentQuiz extends ICurrentQuizData {
  serialize(): ICurrentQuizData;
}

@Injectable()
export class CurrentQuizService implements ICurrentQuiz, OnDestroy {
  set previousQuestions(value: Array<IQuestion>) {
    this._previousQuestions = value.map(elem => {
      return questionReflection[elem.TYPE](elem);
    });
  }
  set sessionConfiguration(value: ISessionConfiguration) {
    if (!value) {
      return;
    }
    this._sessionConfiguration = new SessionConfiguration(value);
    window.sessionStorage.setItem(`quiz_theme`, value.theme);
    this.themesService.updateCurrentlyUsedTheme();
    this.persistToSessionStorage();
  }
  get sessionConfiguration(): ISessionConfiguration {
    return this._sessionConfiguration;
  }
  get previousQuestions(): Array<IQuestion> {
    return this._previousQuestions;
  }
  get currentQuestion(): any {
    return this._currentQuestion;
  }

  set currentQuestion(value: any) {
    this._currentQuestion = questionReflection[value.TYPE](value);
    this._previousQuestions.push(this._currentQuestion);
    this.persistToSessionStorage();
  }

  set hashtag(value: string) {
    this._hashtag = value;
    this.persistToSessionStorage();
  }

  get hashtag(): string {
    return this._hashtag;
  }

  private _hashtag: string;
  private _currentQuestion: IQuestion;
  private _previousQuestions: Array<IQuestion> = [];
  private _sessionConfiguration: ISessionConfiguration;

  constructor(private themesService: ThemesService) {
    const instance = window.sessionStorage.getItem('current_quiz');
    if (instance) {
      const parsedInstance = JSON.parse(instance);
      this.hashtag = parsedInstance.hashtag;
      this.currentQuestion = parsedInstance.currentQuestion;
      this.previousQuestions = parsedInstance.previousQuestions;
      this.sessionConfiguration = parsedInstance.sessionConfiguration;
    }
  }

  public cleanUp(): void {
    window.sessionStorage.removeItem(`${this.hashtag}_nick`);
    window.sessionStorage.removeItem(`current_quiz`);
  }

  public serialize(): ICurrentQuizData {
    return {
      hashtag: this.hashtag,
      currentQuestion: this.currentQuestion ? this.currentQuestion.serialize() : null,
      previousQuestions: this.previousQuestions ? this.previousQuestions.map(value => value.serialize()) : null,
      sessionConfiguration: this.sessionConfiguration ? this.sessionConfiguration.serialize() : null
    };
  }

  public persistToSessionStorage(): void {
    window.sessionStorage.setItem('current_quiz', JSON.stringify(this.serialize()));
  }

  ngOnDestroy(): void {
    this.persistToSessionStorage();
  }

}
