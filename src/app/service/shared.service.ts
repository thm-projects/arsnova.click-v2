import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  set activeQuizzes(value: Array<string>) {
    this._activeQuizzes = value;
  }
  get activeQuizzes(): Array<string> {
    return this._activeQuizzes;
  }

  private _activeQuizzes: Array<string> = [];

  constructor() { }

}
