import { Injectable } from '@angular/core';
import { AuthorizeApiService } from '../api/authorize/authorize-api.service';

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
    private authorizeApiService: AuthorizeApiService,
  ) {
  }

  public authenticate(token: string): Promise<boolean> {
    return new Promise(resolve => {
      this.authorizeApiService.getAuthorizationForToken(token).subscribe(data => {
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
