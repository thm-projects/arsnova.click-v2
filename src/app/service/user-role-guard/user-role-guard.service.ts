import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserRole } from '../../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  public canActivate(): boolean {
    this.userService.loadConfig();

    if (this.isAllowedToProceed()) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        return: location.pathname,
      },
    });
    return false;
  }

  private isAllowedToProceed(): boolean {
    return this.userService.isLoggedIn && this.userService.isAuthorizedFor(UserRole.CreateQuiz);
  }
}
