import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public AUTHORIZE_TOKEN_GET_URL(token: string): string {
    return `${DefaultSettings.httpLibEndpoint}/authorize/${token}`;
  }

  public getAuthorizationForToken(token: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.AUTHORIZE_TOKEN_GET_URL(token));
  }
}
