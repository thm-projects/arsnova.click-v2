import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { UserEntity } from '../../../lib/entities/UserEntity';
import { IAdminQuiz } from '../../../lib/interfaces/quizzes/IAdminQuiz';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private _getAvailableUsersUrl: string;
  private _getAvailableQuizzesUrl: string;
  private _deleteQuizUrl: string;
  private _deleteUserUrl: string;
  private _putUserUrl: string;
  private _getQuizUrl: string;
  private _postQuizDeactivateUrl: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.initUrls();
  }

  public getAvailableUsers(): Observable<Array<UserEntity>> {
    return this.http.get<Array<UserEntity>>(this._getAvailableUsersUrl, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getAvailableQuizzes(): Observable<Array<IAdminQuiz>> {
    return this.http.get<Array<IAdminQuiz>>(this._getAvailableQuizzesUrl, { headers: { authorization: this.userService.staticLoginToken } });
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

  public getQuiz(quizname: string): Observable<QuizEntity> {
    return this.http.get<QuizEntity>(`${this._getQuizUrl}/${encodeURIComponent(quizname)}`,
      { headers: { authorization: this.userService.staticLoginToken } });
  }

  public deactivateQuiz(quizname: string): Observable<void> {
    return this.http.post<void>(`${this._postQuizDeactivateUrl}`, { quizname }, { headers: { authorization: this.userService.staticLoginToken } });
  }

  private initUrls(): void {
    this._getAvailableUsersUrl = `${DefaultSettings.httpApiEndpoint}/admin/users`;
    this._deleteUserUrl = `${DefaultSettings.httpApiEndpoint}/admin/user`;
    this._putUserUrl = `${DefaultSettings.httpApiEndpoint}/admin/user`;
    this._getAvailableQuizzesUrl = `${DefaultSettings.httpApiEndpoint}/admin/quizzes`;
    this._getQuizUrl = `${DefaultSettings.httpApiEndpoint}/admin/quiz`;
    this._deleteQuizUrl = `${DefaultSettings.httpApiEndpoint}/admin/quiz`;
    this._postQuizDeactivateUrl = `${DefaultSettings.httpApiEndpoint}/admin/quiz`;
  }
}
