import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { ISessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/interfaces';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CasLoginService implements CanLoad, CanActivate {

  public casLoginRequired = false;
  public quizName = '';
  public ticket: string = null;

  constructor(private userService: UserService, private quizApiService: QuizApiService) {
  }

  public canActivate(): Promise<boolean> {
    return this.canLoad();
  }

  public async canLoad(): Promise<boolean> {
    await this.userService.loadConfig();

    if (this.userService.isLoggedIn || !this.casLoginRequired) {
      return true;
    }

    if (this.ticket) {
      return await this.userService.authenticateThroughCas(this.ticket);
    }

    if (!this.quizName) {
      location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
      return false;
    }

    const data = await this.quizApiService.getQuizSettings(this.quizName).toPromise();
    if (data.status !== 'STATUS:SUCCESSFUL') {
      return true;
    }

    const settings = <ISessionConfiguration>data.payload.settings;
    if (settings.nicks.restrictToCasLogin) {
      location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
      return false;
    }

    return true;
  }
}
