import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { DefaultSettings } from '../../../../lib/default.settings';
import { MemberEntity } from '../../../../lib/entities/member/MemberEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';

@Injectable({
  providedIn: 'root',
})
export class MemberApiService {
  private _putMemberUrl: string;

  get putMemberUrl(): string {
    return this._putMemberUrl;
  }

  private _putResponseUrl: string;

  get putResponseUrl(): string {
    return this._putResponseUrl;
  }

  private _deleteMemberUrl: string;

  get deleteMemberUrl(): string {
    return this._deleteMemberUrl;
  }

  private _getAvailableMemberNamesUrl: string;

  get getAvailableMemberNamesUrl(): string {
    return this._getAvailableMemberNamesUrl;
  }

  private _putConfidenceValueUrl: string;

  get putConfidenceValueUrl(): string {
    return this._putConfidenceValueUrl;
  }

  private _putReadingConfirmationValueUrl: string;

  get putReadingConfirmationValueUrl(): string {
    return this._putReadingConfirmationValueUrl;
  }

  private _getMembersUrl: string;
  private _postMemberTokenUrl: string;

  constructor(private http: HttpClient) {
    this.loadUrls();
  }

  public putMember(member: MemberEntity): Observable<IMessage> {
    return this.http.put<IMessage>(this._putMemberUrl, { member }, { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) } });
  }

  public putResponse(response: any): Observable<IMessage> {
    return this.http.put<IMessage>(this._putResponseUrl, { response }, { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) } });
  }

  public deleteMember(quizName, nickName): Observable<IMessage> {
    if (!quizName || !nickName || !quizName.length || !nickName.length || nickName === 'null') {
      return of(null);
    }

    return this.http.delete<IMessage>(`${this._deleteMemberUrl}/${quizName}/${nickName}`,
      { headers: { authorization: localStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getMembers(quizname: string): Observable<IMessage> {
    return this.http.get<IMessage>(`${this._getMembersUrl}/${quizname}`,
      { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) || localStorage.getItem(StorageKey.PrivateKey) } });
  }

  public getAvailableNames(quizName: string): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this._getAvailableMemberNamesUrl}/${quizName}`);
  }

  public putConfidenceValue(confidenceValue: number): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putConfidenceValueUrl}`, { confidenceValue },
      { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) } });
  }

  public putReadingConfirmationValue(): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putReadingConfirmationValueUrl}`, {},
      { headers: { authorization: sessionStorage.getItem(StorageKey.QuizToken) } });
  }

  public generateMemberToken(name, quizName): Observable<string> {
    return this.http.post<string>(`${this._postMemberTokenUrl}`, {
      name,
      quizName,
    });
  }

  private loadUrls(): void {
    this._putMemberUrl = `${DefaultSettings.httpApiEndpoint}/member`;
    this._deleteMemberUrl = `${DefaultSettings.httpApiEndpoint}/member`;
    this._getMembersUrl = `${DefaultSettings.httpApiEndpoint}/member`;
    this._getAvailableMemberNamesUrl = `${DefaultSettings.httpApiEndpoint}/member/available`;
    this._putResponseUrl = `${DefaultSettings.httpApiEndpoint}/member/response`;
    this._putConfidenceValueUrl = `${DefaultSettings.httpApiEndpoint}/member/confidence-value`;
    this._putReadingConfirmationValueUrl = `${DefaultSettings.httpApiEndpoint}/member/reading-confirmation`;
    this._postMemberTokenUrl = `${DefaultSettings.httpApiEndpoint}/member/token`;
  }
}
