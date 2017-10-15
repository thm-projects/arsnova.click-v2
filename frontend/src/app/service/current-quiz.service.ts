import {Injectable, OnDestroy} from '@angular/core';
import {IQuestion} from '../../lib/questions/interfaces';
import {questionReflection} from '../../lib/questions/question_reflection';

export declare interface ICurrentQuizData {
  hashtag: string;
  currentQuestion: IQuestion;
}

export declare interface ICurrentQuiz extends ICurrentQuizData {
  serialize(): ICurrentQuizData;
}

@Injectable()
export class CurrentQuizService implements ICurrentQuiz, OnDestroy {
  get currentQuestion(): any {
    return this._currentQuestion;
  }

  set currentQuestion(value: any) {
    this._currentQuestion = questionReflection[value.TYPE](value);
  }

  set hashtag(value: string) {
    this._hashtag = value;
  }

  get hashtag(): string {
    return this._hashtag;
  }

  private _hashtag: string;
  private _currentQuestion: IQuestion;

  constructor() {
    const instance = window.sessionStorage.getItem('current_quiz');
    if (instance) {
      const parsedInstance = JSON.parse(instance);
      this._hashtag = parsedInstance.hashtag;
      this._currentQuestion = parsedInstance.currentQuestion;
    }
  }

  public serialize(): ICurrentQuizData {
    return {
      hashtag: this.hashtag,
      currentQuestion: this.currentQuestion
    };
  }

  ngOnDestroy(): void {
    window.sessionStorage.setItem('current_quiz', JSON.stringify(this.serialize()));
  }

}
