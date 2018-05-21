import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable()
export class UserService {
  private _isLoggedIn: boolean;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  private _ticket: string;

  get ticket(): string {
    return this._ticket;
  }

  constructor(
    private http: HttpClient,
  ) {
  }

  public authenticate(token: string): Promise<boolean> {
    return new Promise(resolve => {
      this.http.get(`${DefaultSettings.httpLibEndpoint}/authorize/${token}`).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL') {
          this._isLoggedIn = true;
          this._ticket = data.payload.ticket;
          resolve(true);
        } else {
          this._isLoggedIn = false;
          resolve(false);
        }
      });
    });
  }

}
