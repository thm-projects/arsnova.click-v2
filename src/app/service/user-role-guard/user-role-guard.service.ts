import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserRole } from '../../lib/enums/UserRole';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleGuardService implements CanActivate {
  constructor(private location: Location, private userService: UserService, private router: Router) { }

  public canActivate(): boolean {
    if (this.isAllowedToProceed()) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        return: this.location.path(),
      },
    });
    return false;
  }

  private isAllowedToProceed(): boolean {
    return this.userService.isLoggedIn && this.userService.isAuthorizedFor(UserRole.CreateQuiz);
  }
}
