import { Injectable } from '@angular/core';
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
export class CurrentQuizService implements ICurrentQuiz {
  get currentQuestion(): any {
    return this._currentQuestion;
  }
  set currentQuestion(value: any) {
    this._currentQuestion = questionReflection[value.type](value);
  }
  set hashtag(value: string) {
    this._hashtag = value;
  }
  get hashtag(): string {
    return this._hashtag;
  }
  private _hashtag: string;
  private _currentQuestion: IQuestion;

  constructor() {}

  public serialize(): ICurrentQuizData {
    return {
      hashtag: this.hashtag,
      currentQuestion: this.currentQuestion
    };
  }

}
