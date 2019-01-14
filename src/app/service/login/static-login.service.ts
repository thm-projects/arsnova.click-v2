import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '../../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    await this.userService.loadConfig();

    console.log('is allowed to proceed', this.isAllowedToProceed(route));
    if (this.isAllowedToProceed(route)) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        return: state.url,
      },
    });
    return false;
  }

  private isAllowedToProceed(route): boolean {
    if (!this.userService.isLoggedIn) {
      return false;
    }

    switch (route.routeConfig.path) {
      case 'i18n-manager':
        return this.userService.isAuthorizedFor(UserRole.EditI18n);
      case 'quiz-manager':
        return this.userService.isAuthorizedFor(UserRole.CreateExpiredQuiz);
      default:
        return true;
    }
  }
}
