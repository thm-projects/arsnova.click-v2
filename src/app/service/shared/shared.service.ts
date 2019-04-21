import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {
  private _activeQuizzes: Array<string> = [];

  get activeQuizzes(): Array<string> {
    return this._activeQuizzes;
  }

  set activeQuizzes(value: Array<string>) {
    this._activeQuizzes = value;
  }

  private _isLoadingEmitter = new BehaviorSubject<boolean>(true);

  get isLoadingEmitter(): BehaviorSubject<boolean> {
    return this._isLoadingEmitter;
  }

  constructor() { }

}
