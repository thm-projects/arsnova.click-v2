import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../../lib/default.settings';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _getAvailableUsersUrl: string;
  private _getAvailableQuizzesUrl: string;
  private _deleteQuizUrl: string;
  private _deleteUserUrl: string;
  private _putUserUrl: string;
  private _getQuizUrl: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.initUrls();
  }

  public getAvailableUsers(): Observable<Array<object>> {
    return this.http.get<Array<object>>(this._getAvailableUsersUrl, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getAvailableQuizzes(): Observable<Array<object>> {
    return this.http.get<Array<object>>(this._getAvailableQuizzesUrl, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public deleteQuiz(quizName: string): Observable<void> {
    return this.http.delete<void>(this._deleteQuizUrl + '/' + quizName, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(this._deleteUserUrl + '/' + username, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public updateUser(value: object): Observable<void> {
    return this.http.put<void>(this._putUserUrl, value, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getQuiz(quizname: string): Observable<object> {
    return this.http.get(`${this._getQuizUrl}/${quizname}`, { headers: { authorization: this.userService.staticLoginToken } });
  }

  private initUrls(): void {
    this._getAvailableUsersUrl = `${DefaultSettings.httpApiEndpoint}/admin/users`;
    this._deleteUserUrl = `${DefaultSettings.httpApiEndpoint}/admin/user`;
    this._putUserUrl = `${DefaultSettings.httpApiEndpoint}/admin/user`;
    this._getAvailableQuizzesUrl = `${DefaultSettings.httpApiEndpoint}/admin/quizzes`;
    this._getQuizUrl = `${DefaultSettings.httpApiEndpoint}/admin/quiz`;
    this._deleteQuizUrl = `${DefaultSettings.httpApiEndpoint}/admin/quiz`;
  }
}
