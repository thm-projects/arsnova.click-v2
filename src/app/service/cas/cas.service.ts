import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { ISessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/interfaces';
import { DefaultSettings } from '../../../lib/default.settings';
import { UserService } from '../user/user.service';

@Injectable()
export class CasService implements CanLoad, CanActivate {

  public casLoginRequired = false;
  public quizName = '';
  public ticket: string = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
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
        await this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/settings/${this.quizName}`).subscribe((data: IMessage) => {
          if (data.status === 'STATUS:SUCCESSFUL') {
            const settings = <ISessionConfiguration>data.payload.settings;
            if (settings.nicks.restrictToCasLogin) {
              location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
              return false;
            } else {
              return true;
            }
          }
        });
      }
    }
  }
}
