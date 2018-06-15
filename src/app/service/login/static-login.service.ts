import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class StaticLoginService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    await this.userService.loadConfig();

    if (this.userService.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        return: state.url,
      },
    });
    return false;
  }
}
