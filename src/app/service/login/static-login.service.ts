import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Route } from '@angular/router/src/config';
import { UrlSegment } from '@angular/router/src/url_tree';
import { UserRole } from '../../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanLoad {

  constructor(private router: Router, private userService: UserService) { }

  public canLoad(route: Route, segments: UrlSegment[]): boolean {
    this.userService.loadConfig();

    console.log('is allowed to proceed', this.isAllowedToProceed(route));
    if (this.isAllowedToProceed(route)) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        return: segments.map(segment => segment.path).join('/'),
      },
    });
    return false;
  }

  private isAllowedToProceed(route: Route): boolean {
    if (!this.userService.isLoggedIn) {
      return false;
    }

    switch (route.path) {
      case 'i18n-manager':
        return this.userService.isAuthorizedFor(UserRole.EditI18n);
      case 'quiz-manager':
        return this.userService.isAuthorizedFor(UserRole.CreateExpiredQuiz);
      default:
        return true;
    }
  }
}
