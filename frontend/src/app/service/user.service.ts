import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  private _isLoggedIn: boolean;

  constructor() { }

}
