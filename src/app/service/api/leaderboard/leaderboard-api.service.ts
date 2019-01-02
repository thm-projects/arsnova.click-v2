import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardApiService {

  constructor(private http: HttpClient) { }

  public LEADERBOARD_GET_DATA_URL(quizName: string, questionIndex?: number): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/${quizName}/${questionIndex}`;
  }

  public getLeaderboardData(quizName: string, questionIndex?: number): Observable<IMessage> {
    return this.http.get<IMessage>(this.LEADERBOARD_GET_DATA_URL(quizName, questionIndex));
  }
}
