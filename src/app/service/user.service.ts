import {Injectable} from '@angular/core';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../lib/default.settings';

@Injectable()
export class UserService {
  get ticket(): string {
    return this._ticket;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  private _isLoggedIn: boolean;
  private _ticket: string;

  constructor(
    private http: HttpClient
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
