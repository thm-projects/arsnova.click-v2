import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/dist/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';
import { PROJECT } from '../../../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class I18nManagerApiService {

  private readonly BE_BASE_URL = 'arsnova-click-v2-backend';
  private readonly FE_BASE_URL = 'arsnova-click-v2-frontend';

  constructor(private http: HttpClient) { }

  public GET_FE_PROJECT_URL(): string {
    return `${DefaultSettings.ssrEndpoint}/api/v1/plugin/i18nator/${this.FE_BASE_URL}`;
  }

  public GET_BE_PROJECT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/plugin/i18nator/${this.BE_BASE_URL}`;
  }

  public GET_UNUSED_KEYS_URL(baseUrl): string {
    return `${baseUrl}/unusedKeys`;
  }

  public GET_LANG_FILE_URL(baseUrl): string {
    return `${baseUrl}/langFile`;
  }

  public POST_UPDATE_PROJECT_URL(baseUrl): string {
    return `${baseUrl}/updateLang`;
  }

  public IS_AUTHORIZED_PROJECT_URL(baseUrl: string): string {
    return `${baseUrl}/authorized`;
  }

  public getLangFileForFE(): Observable<IMessage> {
    return this.http.get<IMessage>(this.GET_LANG_FILE_URL(this.GET_FE_PROJECT_URL()));
  }

  public postUpdateLangForFE(data: Array<any>): Observable<IMessage> {
    return this.http.post<IMessage>(this.POST_UPDATE_PROJECT_URL(this.GET_FE_PROJECT_URL()), data);
  }

  public getLangFileForBE(): Observable<IMessage> {
    return this.http.get<IMessage>(this.GET_LANG_FILE_URL(this.GET_BE_PROJECT_URL()));
  }

  public postUpdateLangForBE(data: Array<any>): Observable<IMessage> {
    return this.http.post<IMessage>(this.POST_UPDATE_PROJECT_URL(this.GET_BE_PROJECT_URL()), data);
  }

  public getLangFileForProject(currentProject: PROJECT): Observable<IMessage> {
    switch (currentProject) {
      case PROJECT.FRONTEND:
        return this.getLangFileForFE();
      case PROJECT.BACKEND:
        return this.getLangFileForBE();
    }
  }

  public postUpdateLangForProject(currentProject: PROJECT, data: Array<any>): Observable<IMessage> {
    switch (currentProject) {
      case PROJECT.FRONTEND:
        return this.postUpdateLangForFE(data);
      case PROJECT.BACKEND:
        return this.postUpdateLangForBE(data);
    }
  }

  public isAuthorizedForProject(currentProject: PROJECT, data: object): Observable<IMessage> {
    switch (currentProject) {
      case PROJECT.FRONTEND:
        return this.isAuthorizedForFE(data);
      case PROJECT.BACKEND:
        return this.isAuthorizedForBE(data);
    }
  }

  private isAuthorizedForFE(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.IS_AUTHORIZED_PROJECT_URL(this.GET_FE_PROJECT_URL()), data);
  }

  private isAuthorizedForBE(data: object): Observable<IMessage> {
    return this.http.post<IMessage>(this.IS_AUTHORIZED_PROJECT_URL(this.GET_BE_PROJECT_URL()), data);
  }
}
