import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { UserRole } from '../../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanLoad {

  constructor(private router: Router, private userService: UserService) { }

  public canLoad(route: Route, segments: UrlSegment[]): boolean {
    this.userService.loadConfig();

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
      case 'admin':
        return this.userService.isAuthorizedFor([UserRole.QuizAdmin, UserRole.SuperAdmin]);
      default:
        return true;
    }
  }
}
