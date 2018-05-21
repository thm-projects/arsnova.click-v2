import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private _activeQuizzes: Array<string> = [];

  get activeQuizzes(): Array<string> {
    return this._activeQuizzes;
  }

  set activeQuizzes(value: Array<string>) {
    this._activeQuizzes = value;
  }

  constructor() { }

}
