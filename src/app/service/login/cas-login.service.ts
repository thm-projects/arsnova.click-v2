import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { DefaultSettings } from '../../../lib/default.settings';
import { StatusProtocol } from '../../../lib/enums/Message';
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
    this.userService.loadConfig();

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

    const data = await this.quizApiService.getQuizStatus(this.quizName).toPromise();
    if (data.status !== StatusProtocol.Success) {
      return true;
    }

    if (data.payload.authorizeViaCas) {
      location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
      return false;
    }

    return true;
  }
}
