import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/dist/common';
import { IQuestionGroup } from 'arsnova-click-v2-types/dist/questions';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class QuizApiService {

  constructor(private http: HttpClient) { }

  public QUIZ_STATUS_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/status/${quizName}`;
  }

  public QUIZ_MEMBER_GROUP_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/${quizName}/freeGroup`;
  }

  public QUIZ_CURRENT_STATE_URL(quizName): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/currentState/${quizName}`;
  }

  public QUIZ_RESERVATION_OVERRIDE_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/reserve/override`;
  }

  public QUIZ_RESERVATION_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/reserve`;
  }

  public QUIZ_POST_DATA_URL(target: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/${target}`;
  }

  public QUIZ_STOP_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/stop`;
  }

  public QUIZ_RESET_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/reset/${quizName}`;
  }

  public QUIZ_GET_START_TIME_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/startTime/${quizName}`;
  }

  public QUIZ_DELETE_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz`;
  }

  public QUIZ_DEACTIVATE_DELETE_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/active`;
  }

  public QUIZ_GENERATE_DEMO_QUIZ_URL(languageKey: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/generate/demo/${languageKey}`;
  }

  public QUIZ_GENERATE_ABCD_QUIZ_URL(languageKey: string, length: number): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/generate/abcd/${languageKey}/${length}`;
  }

  public QUIZ_CACHE_QUIZ_ASSETS_POST_URL(): string {
    return `${DefaultSettings.httpLibEndpoint}/cache/quiz/assets`;
  }

  public QUIZ_SETTINGS_UPDATE_POST_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/settings/update`;
  }

  public QUIZ_SETTINGS_GET_URL(quizName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/settings/${quizName}`;
  }

  public QUIZ_UPLOAD_POST_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/quiz/upload`;
  }

  public QUIZ_EXPIRY_GET_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/expiry-quiz/`;
  }

  public QUIZ_EXPIRY_POST_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/expiry-quiz/quiz`;
  }

  public getQuizStatus(quizName): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_STATUS_URL(quizName));
  }

  public postQuizReservationOverride(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_RESERVATION_OVERRIDE_URL(), data);
  }

  public postQuizReservation(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_RESERVATION_URL(), data);
  }

  public getFreeMemberGroup(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_MEMBER_GROUP_URL(quizName));
  }

  public postQuizData(target: string, data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_POST_DATA_URL(target), data);
  }

  public getCurrentQuizState(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_CURRENT_STATE_URL(quizName));
  }

  public patchQuizReset(quizName: string, data: object = {}): Observable<IMessage> {
    return this.http.patch<IMessage>(this.QUIZ_RESET_URL(quizName), data);
  }

  public postQuizStop(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_STOP_URL(), data);
  }

  public getQuizStartTime(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_GET_START_TIME_URL(quizName));
  }

  public deleteQuiz(data: object): Observable<IMessage> {
    return this.http.request<IMessage>('delete', this.QUIZ_DELETE_URL(), data);
  }

  public deactivateQuizAsOwner(data: object): Observable<IMessage> {
    return this.http.request<IMessage>('delete', this.QUIZ_DEACTIVATE_DELETE_URL(), data);
  }

  public generateDemoQuiz(languageKey: string): Observable<IQuestionGroup> {
    return this.http.get<IQuestionGroup>(this.QUIZ_GENERATE_DEMO_QUIZ_URL(languageKey));
  }

  public generateABCDQuiz(languageKey: string, length: number): Observable<IQuestionGroup> {
    return this.http.get<IQuestionGroup>(this.QUIZ_GENERATE_ABCD_QUIZ_URL(languageKey, length));
  }

  public postCacheQuizAssets(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_CACHE_QUIZ_ASSETS_POST_URL(), data);
  }

  public postQuizSettingsUpdate(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_SETTINGS_UPDATE_POST_URL(), data);
  }

  public getQuizSettings(quizName: string): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_SETTINGS_GET_URL(quizName));
  }

  public postQuizUpload(formData: FormData): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_UPLOAD_POST_URL(), formData);
  }

  public getExpiryQuiz(): Observable<IMessage> {
    return this.http.get<IMessage>(this.QUIZ_EXPIRY_GET_URL());
  }

  public postExpiryQuiz(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_EXPIRY_POST_URL(), data);
  }

  public postInitExpiryQuiz(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.QUIZ_EXPIRY_INIT_POST_URL(), data);
  }

  private QUIZ_EXPIRY_INIT_POST_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/expiry-quiz/init`;
  }
}
