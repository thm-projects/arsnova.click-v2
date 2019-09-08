import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class SharedService {
  private _activeQuizzes: Array<string> = [];

  get activeQuizzes(): Array<string> {
    return this._activeQuizzes;
  }

  set activeQuizzes(value: Array<string>) {
    this._activeQuizzes = value;
  }

  private _isLoadingEmitter = new ReplaySubject<boolean>(1);

  get isLoadingEmitter(): ReplaySubject<boolean> {
    return this._isLoadingEmitter;
  }

  constructor() {
    this._isLoadingEmitter.next(true);
  }

}
