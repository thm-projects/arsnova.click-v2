import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class MemberApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public MEMBER_CONFIDENCE_VALUE_PUT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/member/confidence-value`;
  }

  public MEMBER_READING_CONFIRMATION_PUT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/member/reading-confirmation`;
  }

  public MEMBER_DELETE_URL(quizName, memberName): string {
    return `${DefaultSettings.httpApiEndpoint}/member/${quizName}/${memberName}`;
  }

  public MEMBER_RESPONSE_PUT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/member/response`;
  }

  public MEMBER_PUT_MEMBER_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/member`;
  }

  public MEMBER_GET_AVAILABLE_NAMES_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/member/${quizName}/available`;
  }

  public putConfidenceValue(data: object): Observable<IMessage> {
    return this.http.put<IMessage>(this.MEMBER_CONFIDENCE_VALUE_PUT_URL(), data);
  }

  public deleteMember(quizName, memberName): Observable<IMessage> {
    return this.http.delete<IMessage>(this.MEMBER_DELETE_URL(quizName, memberName));
  }

  public putReadingConfirmationValue(data: object): Observable<IMessage> {
    return this.http.put<IMessage>(this.MEMBER_READING_CONFIRMATION_PUT_URL(), data);
  }

  public putResponse(data: object): Observable<IMessage> {
    return this.http.put<IMessage>(this.MEMBER_RESPONSE_PUT_URL(), data);
  }

  public putMember(data): Observable<IMessage> {
    return this.http.put<IMessage>(this.MEMBER_PUT_MEMBER_URL(), data);
  }

  public getAvailableMemberNames(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.MEMBER_GET_AVAILABLE_NAMES_URL(quizName));
  }
}
