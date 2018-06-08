import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class LobbyApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public LOBBY_STATUS_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/lobby/${quizName}`;
  }

  public LOBBY_PUT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/lobby`;
  }

  public getLobbyStatus(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.LOBBY_STATUS_URL(quizName));
  }

  public putLobby(data: object): Observable<IMessage> {
    return this.http.put<IMessage>(this.LOBBY_PUT_URL(), data);
  }
}
