import { Injectable } from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import {UserService} from 'app/service/user.service';
import {DefaultSettings} from './settings.service';

@Injectable()
export class CasService implements CanLoad, CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate() {
    return this.canLoad();
  }

  canLoad() {
    console.log('OnlyLoggedInUsers');
    if (this.userService.isLoggedIn) {
      return true;
    } else {
      console.log('You don\'t have permission to view this page');
      location.href = `${DefaultSettings.httpLibEndpoint}/authorize`;
      return false;
    }
  }
}
