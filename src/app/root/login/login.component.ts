import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public static readonly TYPE = 'LoginComponent';
  public username = '';
  public password = '';

  private _authorizationFailed = false;

  get authorizationFailed(): boolean {
    return this._authorizationFailed;
  }

  private _isLoading = true;

  get isLoading(): boolean {
    return this._isLoading;
  }

  private return = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
  ) {
    this.userService.logout();
    this.headerLabelService.headerLabel = 'Login';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['logout']) {
        this.router.navigate(['/']);
        return;
      }
      this._isLoading = false;
      this.return = params['return'] || '/';
    });
  }

  public async login(): Promise<void> {
    this._authorizationFailed = false;
    if (this.username && this.password) {
      const passwordHash = this.userService.hashPassword(this.username, this.password);

      const isAuthenticated = await this.userService.authenticateThroughLogin(this.username.toLowerCase(), passwordHash);

      if (isAuthenticated) {
        this.router.navigateByUrl(this.return);
      } else {
        this._authorizationFailed = true;
      }
    }
  }

  public trySubmit(event): void {
    if (event.keyCode === 13 && this.username && this.password) {
      this.login();
    }
  }
}
