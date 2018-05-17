import {Injectable} from '@angular/core';
import {CanActivate, CanLoad} from '@angular/router';
import {UserService} from './user.service';
import {DefaultSettings} from '../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {IMessage} from 'arsnova-click-v2-types/src/common';
import {ISessionConfiguration} from 'arsnova-click-v2-types/src/session_configuration/interfaces';

@Injectable()
export class CasService implements CanLoad, CanActivate {

  public casLoginRequired = false;
  public quizName = '';
  public ticket: string = null;

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {
  }

  canActivate() {
    return this.canLoad();
  }

  async canLoad() {
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
