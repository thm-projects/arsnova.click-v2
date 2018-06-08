import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { ISessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/interfaces';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CasService implements CanLoad, CanActivate {

  public casLoginRequired = false;
  public quizName = '';
  public ticket: string = null;

  constructor(
    private userService: UserService,
    private quizApiService: QuizApiService,
  ) {
  }

  public canActivate(): Promise<boolean> {
    return this.canLoad();
  }

  public async canLoad(): Promise<boolean> {
    if (this.userService.isLoggedIn || !this.casLoginRequired) {
      return true;
    } else {
      if (this.ticket) {
        return await this.userService.authenticate(this.ticket);
      } else {
        return new Promise<boolean>(async resolve => {
          const data = await this.quizApiService.getQuizSettings(this.quizName).toPromise();
          if (data.status === 'STATUS:SUCCESSFUL') {
            const settings = <ISessionConfiguration>data.payload.settings;
            if (settings.nicks.restrictToCasLogin) {
              location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
              resolve(false);
              return;
            }
          }

          resolve(true);
          return;
        });
      }
    }
  }
}
