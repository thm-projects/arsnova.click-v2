import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { AbstractQuestionEntity } from '../../../lib/entities/question/AbstractQuestionEntity';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class QuizPoolApiService {
  private _getQuizpoolUrl: string;
  private _getQuizpoolTagsUrl: string;
  private _getPendingQuizpoolUrl: string;
  private _postNewQuestionUrl: string;
  private _putApproveQuestionUrl: string;
  private _deletePoolQuestionUrl: string;
  private _getPendingQuizpoolQuestionUrl: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.loadUrls();
  }

  public getQuizpool(tags: Array<string>, amount: number): Observable<IMessage> {
    return this.http.post<IMessage>(this._getQuizpoolUrl, { tags, amount });
  }

  public getQuizpoolTags(): Observable<IMessage> {
    return this.http.get<IMessage>(this._getQuizpoolTagsUrl).pipe(map(data => {
      data.payload = Object.entries<{ [key: string]: number }>(data.payload).map(v => (
        {
          text: v[0],
          weight: v[1],
        }
      ));

      return data;
    }));
  }

  public getPendingQuizpool(): Observable<IMessage> {
    return this.http.get<IMessage>(this._getPendingQuizpoolUrl, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public postNewQuestion(question: AbstractQuestionEntity): Observable<IMessage> {
    return this.http.post<IMessage>(this._postNewQuestionUrl, {
      question,
    });
  }

  public putApproveQuestion(id: string, question?: AbstractQuestionEntity, approved?: boolean): Observable<IMessage> {
    return this.http.put<IMessage>(this._putApproveQuestionUrl, {
      id,
      question,
      approved,
    }, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public deletePoolQuestion(id: string): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._deletePoolQuestionUrl}/${id}`, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getQuizpoolQuestion(id: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getPendingQuizpoolQuestionUrl}/${id}`, { headers: { authorization: this.userService.staticLoginToken } });
  }

  private loadUrls(): void {
    this._getQuizpoolUrl = `${DefaultSettings.httpApiEndpoint}/quizpool/generate`;
    this._getQuizpoolTagsUrl = `${DefaultSettings.httpApiEndpoint}/quizpool/tags`;
    this._getPendingQuizpoolUrl = `${DefaultSettings.httpApiEndpoint}/quizpool/pending`;
    this._getPendingQuizpoolQuestionUrl = `${DefaultSettings.httpApiEndpoint}/quizpool/pending`;
    this._postNewQuestionUrl = `${DefaultSettings.httpApiEndpoint}/quizpool`;
    this._putApproveQuestionUrl = `${DefaultSettings.httpApiEndpoint}/quizpool/pending`;
    this._deletePoolQuestionUrl = `${DefaultSettings.httpApiEndpoint}/quizpool`;
  }
}
