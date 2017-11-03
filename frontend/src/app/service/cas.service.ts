import {Injectable} from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import {UserService} from 'app/service/user.service';
import {DefaultSettings} from '../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';
import {ISessionConfiguration} from '../../lib/session_configuration/interfaces';

@Injectable()
export class CasService implements CanLoad, CanActivate {

  public casLoginRequired = false;
  public quizName = '';

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {
  }

  canActivate() {
    return this.canLoad();
  }

  canLoad() {
    console.log('OnlyLoggedInUsers');
    if (this.userService.isLoggedIn || !this.casLoginRequired) {
      return true;
    } else {
      this.http.get(`${DefaultSettings.httpApiEndpoint}/quiz/settings/${this.quizName}`).subscribe((data: IMessage) => {
        if (data.status === 'STATUS:SUCCESSFUL') {
          const settings = <ISessionConfiguration>data.payload.settings;
          if (settings.nicks.restrictToCasLogin) {
            console.log('You don\'t have permission to view this page');
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
