import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';

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

  private _getFullQuizStatusDataUrl: string;
  private _initQuizInstanceUrl: string;
  private _getQuizUrl: string;
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
    if (!environment.readingConfirmationEnabled) {
      quiz.sessionConfig.readingConfirmationEnabled = false;
    }
    if (!environment.confidenceSliderEnabled) {
      quiz.sessionConfig.confidenceSliderEnabled = false;
    }

    return this.http.put<QuizEntity>(this._putQuizUrl, { quiz }, {
      headers: {
        authorization: sessionStorage.getItem(StorageKey.PrivateKey),
      },
    });
  }

  public nextStep(quizName: string): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postNextStepUrl}`, { quizName },
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public deleteQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._deleteQuizUrl}/${encodeURIComponent(quiz.name)}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public resetQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postResetQuizUrl}/${encodeURIComponent(quiz.name)}`, {},
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public stopQuiz(quiz: QuizEntity): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postStopQuizUrl}`, { quizName: quiz.name },
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public postQuizSettingsUpdate(quiz: QuizEntity, settings: object): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postQuizSettingsUpdateUrl}`, {
      quizName: quiz.name,
      settings,
    }, { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getQuizSettings(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getQuizSettingsUrl}/${encodeURIComponent(quizName)}`);
  }

  public postQuizUpload(formData: FormData): Observable<IMessage> {
    return this.http.post<IMessage>(`${this._postQuizUploadUrl}`, formData,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getQuizStatus(quizName): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getQuizStatusUrl}${quizName ? '/' + quizName : ''}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getFullQuizStatusData(quizName): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getFullQuizStatusDataUrl}${quizName ? '/' + quizName : ''}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getQuiz(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getQuizUrl}/${encodeURIComponent(quizName)}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getQuizStartTime(): Observable<number> {
    return this.http.get<number>(`${this._getQuizStartTimeUrl}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) || sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getFreeMemberGroup(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getFreeMemberGroupUrl}/${encodeURIComponent(quizName)}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) || sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public generateABCDQuiz(language: string, length: number): Observable<QuizEntity> {
    return this.http.get<QuizEntity>(`${this._getAbcdQuizUrl}/${encodeURIComponent(language)}/${encodeURIComponent(length)}`);
  }

  public generateDemoQuiz(language: string): Observable<QuizEntity> {
    return this.http.get<QuizEntity>(`${this._getDemoQuizUrl}/${encodeURIComponent(language)}`);
  }

  public deleteActiveQuiz(quiz: QuizEntity): Observable<void> {
    return this.http.delete<void>(`${this._deleteActiveQuizUrl}/${encodeURIComponent(quiz.name)}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public putSavedQuiz(quizEntity: QuizEntity): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putSaveQuizUrl}`, { quiz: quizEntity },
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getPublicQuizzes(): Observable<Array<QuizEntity>> {
    return this.http.get<Array<QuizEntity>>(this._getPublicQuizzesUrl, { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getOwnPublicQuizzes(): Observable<Array<QuizEntity>> {
    return this.http.get<Array<QuizEntity>>(this._getOwnPublicQuizzesUrl,
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getPublicQuizAmount(): Observable<number> {
    return this.http.get<number>(this._getPublicQuizAmountUrl, { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getOwnPublicQuizAmount(): Observable<number> {
    return this.http.get<number>(this._getOwnPublicQuizAmountUrl, { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public setQuizAsPrivate(quizEntity: QuizEntity): Observable<void> {
    return this.http.post<void>(this._setQuizAsPrivateUrl, { name: quizEntity.name },
      { headers: { authorization: sessionStorage.getItem(StorageKey.PrivateKey) } });
  }

  public initQuizInstance(name: string): Observable<IMessage> {
    return this.http.post<IMessage>(this._initQuizInstanceUrl, { name }, {
      headers: {
        'X-Access-Token': sessionStorage.getItem(StorageKey.LoginToken),
        authorization: sessionStorage.getItem(StorageKey.PrivateKey),
      },
    });
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
    this._getQuizUrl = `${DefaultSettings.httpApiEndpoint}/quiz/quiz`;
    this._getQuizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status`;
    this._getFullQuizStatusDataUrl = `${DefaultSettings.httpApiEndpoint}/quiz/full-status`;
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
    this._initQuizInstanceUrl = `${DefaultSettings.httpApiEndpoint}/quiz/public/init`;
  }
}
