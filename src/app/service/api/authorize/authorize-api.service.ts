import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeApiService {

  constructor(private http: HttpClient) { }

  public AUTHORIZE_TOKEN_GET_URL(token: string): string {
    return `${DefaultSettings.httpLibEndpoint}/authorize/${encodeURIComponent(token)}`;
  }

  public AUTHORIZE_STATIC_POST_URL(): string {
    return `${DefaultSettings.httpLibEndpoint}/authorize/static`;
  }

  public AUTHORIZE_VALIDATE_TOKEN_GET_URL(username, token: string): string {
    return `${DefaultSettings.httpLibEndpoint}/authorize/validate/${encodeURIComponent(username)}/${encodeURIComponent(token)}`;
  }

  public getAuthorizationForToken(token: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.AUTHORIZE_TOKEN_GET_URL(token));
  }

  public postAuthorizationForStaticLogin(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.AUTHORIZE_STATIC_POST_URL(), data);
  }

  public getValidateStaticLoginToken(username: string, token: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.AUTHORIZE_VALIDATE_TOKEN_GET_URL(username, token));
  }
}
