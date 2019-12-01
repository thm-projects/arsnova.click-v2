import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const url = route.url.map(u => u.path).join('/');

    return this.isAllowedToProceed(url).pipe(map(isAllowedToProceed => {
      if (isAllowedToProceed) {
        return true;
      }

      return this.router.createUrlTree(['/login'], {
        queryParams: {
          return: url,
        },
      });
    }), take(1));
  }

  private isAllowedToProceed(url: string): Observable<boolean> {
    return this.userService.loginNotifier.pipe(map(isLoggedIn => {
      if (!isLoggedIn) {
        return false;
      }

      switch (url) {
        case 'i18n-manager':
          return this.userService.isAuthorizedFor(UserRole.EditI18n);
        case 'admin':
          return this.userService.isAuthorizedFor([UserRole.QuizAdmin, UserRole.SuperAdmin]);
        default:
          return true;
      }
    }));
  }
}
