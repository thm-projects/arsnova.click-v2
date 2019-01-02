import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../../lib/default.settings';
import { Project } from '../../../../lib/enums/enums';
import { IMessage } from '../../../../lib/interfaces/communication/IMessage';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class I18nManagerApiService {

  private readonly BE_BASE_URL = 'arsnova-click-v2-backend';
  private readonly FE_BASE_URL = 'arsnova-click-v2-frontend';

  constructor(private http: HttpClient, private userService: UserService) { }

  public GET_FE_PROJECT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/plugin/i18nator/${this.FE_BASE_URL}`;
  }

  public GET_BE_PROJECT_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/plugin/i18nator/${this.BE_BASE_URL}`;
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
    return this.http.get<IMessage>(this.GET_LANG_FILE_URL(this.GET_FE_PROJECT_URL()),
      { headers: { authorization: this.userService.staticLoginToken } });
  }

  public postUpdateLangForFE(data: Array<any>): Observable<IMessage> {
    return this.http.post<IMessage>(this.POST_UPDATE_PROJECT_URL(this.GET_FE_PROJECT_URL()), {
      data,
      gitlabToken: this.userService.staticLoginTokenContent.gitlabToken,
    }, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getLangFileForBE(): Observable<IMessage> {
    return this.http.get<IMessage>(this.GET_LANG_FILE_URL(this.GET_BE_PROJECT_URL()),
      { headers: { authorization: this.userService.staticLoginToken } });
  }

  public postUpdateLangForBE(data: Array<any>): Observable<IMessage> {
    return this.http.post<IMessage>(this.POST_UPDATE_PROJECT_URL(this.GET_BE_PROJECT_URL()), {
      data,
      gitlabToken: this.userService.staticLoginTokenContent.gitlabToken,
    }, { headers: { authorization: this.userService.staticLoginToken } });
  }

  public getLangFileForProject(currentProject: Project): Observable<IMessage> {
    switch (currentProject) {
      case Project.Frontend:
        return this.getLangFileForFE();
      case Project.Backend:
        return this.getLangFileForBE();
    }
  }

  public postUpdateLangForProject(currentProject: Project, data: Array<any>): Observable<IMessage> {
    switch (currentProject) {
      case Project.Frontend:
        return this.postUpdateLangForFE(data);
      case Project.Backend:
        return this.postUpdateLangForBE(data);
    }
  }

  public isAuthorizedForProject(currentProject: Project, data: object): Observable<boolean> {
    switch (currentProject) {
      case Project.Frontend:
        return this.isAuthorizedForFE(data);
      case Project.Backend:
        return this.isAuthorizedForBE(data);
    }
  }

  private isAuthorizedForFE(data: object): Observable<boolean> {
    return this.http.post<boolean>(this.IS_AUTHORIZED_PROJECT_URL(this.GET_FE_PROJECT_URL()), data,
      { headers: { authorization: this.userService.staticLoginToken } });
  }

  private isAuthorizedForBE(data: object): Observable<boolean> {
    return this.http.post<boolean>(this.IS_AUTHORIZED_PROJECT_URL(this.GET_BE_PROJECT_URL()), data,
      { headers: { authorization: this.userService.staticLoginToken } });
  }
}
