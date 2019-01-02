import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../../lib/default.settings';
import { QuizEntity } from '../../../../lib/entities/QuizEntity';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';

@Injectable({
  providedIn: 'root',
})
export class QuizApiService {
  private _getFreeMemberGroupUrl: string;

  get getFreeMemberGroupUrl(): string {
    return this._getFreeMemberGroupUrl;
  }

  private _getDemoQuizUrl: string;

  get getDemoQuizUrl(): string {
    return this._getDemoQuizUrl;
  }

  private _getAbcdQuizUrl: string;

  get getAbcdQuizUrl(): string {
    return this._getAbcdQuizUrl;
  }

  private _deleteQuizUrl: string;

  get deleteQuizUrl(): string {
    return this._deleteQuizUrl;
  }

  set deleteQuizUrl(value: string) {
    this._deleteQuizUrl = value;
  }

  private _postQuizSettingsUpdateUrl: string;

  get postQuizSettingsUpdateUrl(): string {
    return this._postQuizSettingsUpdateUrl;
  }

  private _postQuizUploadUrl: string;

  get postQuizUploadUrl(): string {
    return this._postQuizUploadUrl;
  }

  private _getQuizStatusUrl: string;

  get getQuizStatusUrl(): string {
    return this._getQuizStatusUrl;
  }

  private _setQuizAsPrivateUrl: string;
  private _getOwnPublicQuizzesUrl: string;
  private _getOwnPublicQuizAmountUrl: string;
  private _getPublicQuizAmountUrl: string;
  private _getPublicQuizzesUrl: string;
  private _putSaveQuizUrl: string;
  private _getQuizSettingsUrl: string;
  private _deleteActiveQuizUrl: string;
  private _putQuizUrl: string;
  private _postNextStepUrl: string;
  private _postResetQuizUrl: string;
  private _postStopQuizUrl: string;
  private _getQuizStartTimeUrl: string;

  constructor(private http: HttpClient) {
    this.loadUrls();
  }

  public setQuiz(quiz: QuizEntity): Observable<QuizEntity> {
    return this.http.put<QuizEntity>(this._putQuizUrl, { quiz }, {
      headers: {
        authorization: localStorage.getItem('privateKey'),
      },
    });
  }

  public nextStep(): Observable<IMessage> {
    return this.http.post<IMessage>(this._postNextStepUrl, {}, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public deleteQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._deleteQuizUrl}/${quiz.name}`, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public resetQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postResetQuizUrl}/${quiz.name}`, {}, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public stopQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postStopQuizUrl}`, { quizName: quiz.name },
      { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public postQuizSettingsUpdate(settings: object): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postQuizSettingsUpdateUrl}`, { settings },
      { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public getQuizSettings(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getQuizSettingsUrl}/${quizName}`);
  }

  public postQuizUpload(formData: FormData): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postQuizUploadUrl}`, formData, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public getQuizStatus(quizName): Observable<IMessage> {
    const headers: any = {};
    if (!quizName) {
      headers.authorization = sessionStorage.getItem('token');
    }

    return this.http.get<IMessage>(`${this._getQuizStatusUrl}${quizName ? '/' + quizName : ''}`, { headers });
  }

  public getQuizStartTime(): Observable<number> {
    return this.http.get<number>(`${this._getQuizStartTimeUrl}`, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public getFreeMemberGroup(): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getFreeMemberGroupUrl}`, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public generateABCDQuiz(language: string, length: number): Observable<QuizEntity> {
    return this.http.get<QuizEntity>(`${this._getAbcdQuizUrl}/${language}/${length}`);
  }

  public generateDemoQuiz(language: string): Observable<QuizEntity> {
    return this.http.get<QuizEntity>(`${this._getDemoQuizUrl}/${language}`);
  }

  public deleteActiveQuiz(quiz: QuizEntity): Observable<void> {
    return this.http.delete<void>(`${this._deleteActiveQuizUrl}/${quiz.name}`, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public putSavedQuiz(quizEntity: QuizEntity): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putSaveQuizUrl}`, { quiz: quizEntity },
      { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public getPublicQuizzes(): Observable<Array<QuizEntity>> {
    return this.http.get<Array<QuizEntity>>(this._getPublicQuizzesUrl, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public getOwnPublicQuizzes(): Observable<Array<QuizEntity>> {
    return this.http.get<Array<QuizEntity>>(this._getOwnPublicQuizzesUrl, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public getPublicQuizAmount(): Observable<number> {
    return this.http.get<number>(this._getPublicQuizAmountUrl, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public getOwnPublicQuizAmount(): Observable<number> {
    return this.http.get<number>(this._getOwnPublicQuizAmountUrl, { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  public setQuizAsPrivate(quizEntity: QuizEntity): Observable<void> {
    return this.http.post<void>(this._setQuizAsPrivateUrl, { name: quizEntity.name },
      { headers: { authorization: localStorage.getItem('privateKey') } });
  }

  private loadUrls(): void {
    this._putQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz`;
    this._putSaveQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/save`;
    this._postNextStepUrl = `${DefaultSettings.httpApiEndpoint}/quiz/next`;
    this._deleteQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz`;
    this._postResetQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/reset`;
    this._postStopQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/stop`;
    this._postQuizSettingsUpdateUrl = `${DefaultSettings.httpApiEndpoint}/quiz/settings`;
    this._getQuizSettingsUrl = `${DefaultSettings.httpApiEndpoint}/quiz/settings`;
    this._postQuizUploadUrl = `${DefaultSettings.httpApiEndpoint}/quiz/upload`;
    this._getQuizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status`;
    this._getQuizStartTimeUrl = `${DefaultSettings.httpApiEndpoint}/quiz/start-time`;
    this._getFreeMemberGroupUrl = `${DefaultSettings.httpApiEndpoint}/quiz/member-group`;
    this._getAbcdQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/generate/abcd`;
    this._getDemoQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/generate/demo`;
    this._setQuizAsPrivateUrl = `${DefaultSettings.httpApiEndpoint}/quiz/private`;
    this._getPublicQuizzesUrl = `${DefaultSettings.httpApiEndpoint}/quiz/public`;
    this._getPublicQuizAmountUrl = `${DefaultSettings.httpApiEndpoint}/quiz/public/amount`;
    this._getOwnPublicQuizzesUrl = `${DefaultSettings.httpApiEndpoint}/quiz/public/own`;
    this._getOwnPublicQuizAmountUrl = `${DefaultSettings.httpApiEndpoint}/quiz/public/amount/own`;
    this._deleteActiveQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/active`;
  }
}
