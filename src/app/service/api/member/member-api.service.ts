import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../../lib/default.settings';
import { MemberEntity } from '../../../../lib/entities/member/MemberEntity';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';

@Injectable({
  providedIn: 'root',
})
export class MemberApiService {

  private _putMemberUrl: string;
  private _putResponseUrl: string;
  private _deleteMemberUrl: string;
  private _getMembersUrl: string;
  private _getAvailableMemberNamesUrl: string;
  private _putConfidenceValueUrl: string;
  private _putReadingConfirmationValueUrl: string;
  private _postMemberTokenUrl: string;

  constructor(private http: HttpClient) {
    this.loadUrls();
  }

  public putMember(member: MemberEntity): Observable<IMessage> {
    return this.http.put<IMessage>(this._putMemberUrl, { member }, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public putResponse(response: any): Observable<IMessage> {
    return this.http.put<IMessage>(this._putResponseUrl, { response }, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public deleteMember(quizName, nickName): Observable<IMessage> {
    return this.http.delete<IMessage>(`${this._deleteMemberUrl}/${quizName}/${nickName}`,
      { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public getMembers(): Observable<Array<MemberEntity>> {
    return this.http.get<Array<MemberEntity>>(`${this._getMembersUrl}`, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public getAvailableNames(quizName: string): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this._getAvailableMemberNamesUrl}/${quizName}`);
  }

  public putConfidenceValue(confidenceValue: number): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putConfidenceValueUrl}`, { confidenceValue },
      { headers: { authorization: sessionStorage.getItem('token') } });
  }

  public putReadingConfirmationValue(): Observable<IMessage> {
    return this.http.put<IMessage>(`${this._putReadingConfirmationValueUrl}`, {}, { headers: { authorization: sessionStorage.getItem('token') } });
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
