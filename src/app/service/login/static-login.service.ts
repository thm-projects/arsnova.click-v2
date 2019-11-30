import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRole } from '../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanLoad {

  constructor(private router: Router, private userService: UserService) { }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      this.isAllowedToProceed(route).pipe(map(isAllowedToProceed => {
        if (isAllowedToProceed) {
          return true;
        }

        this.router.navigate(['/login'], {
          queryParams: {
            return: segments.map(segment => segment.path).join('/'),
          },
        });
        return false;
      })).subscribe(isAllowedToProceed => {
        subscriber.next(isAllowedToProceed);
        subscriber.complete();
      });
    });
  }

  private isAllowedToProceed(route: Route): Observable<boolean> {
    return this.userService.loginNotifier.pipe(map(isLoggedIn => {
      if (!isLoggedIn) {
        return false;
      }

      switch (route.path) {
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
