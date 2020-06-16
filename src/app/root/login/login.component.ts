import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginMechanism } from '../../lib/enums/enums';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { StorageService } from '../../service/storage/storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'LoginComponent';

  private _authorizationFailed = false;
  private _isLoading = true;
  private return = '';
  private readonly _destroy = new Subject();

  public username = '';
  public password = '';
  public token = '';
  public hasUsernamePasswordLogin: boolean;
  public hasTokenLogin: boolean;
  public isLoggingIn: string;

  get authorizationFailed(): boolean {
    return this._authorizationFailed;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService,
    private storageServie: StorageService,
  ) {
    this.userService.logout();
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this.route.queryParams.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe(params => {
      if (params['logout']) {
        this.router.navigate(['/']);
        return;
      }
      this._isLoading = false;
      this.return = decodeURI(params['return'] || '%2F');

      this.hasTokenLogin = environment.loginMechanism.includes(LoginMechanism.Token) && this.return.includes('/quiz/create');
      this.hasUsernamePasswordLogin = environment.loginMechanism.includes(LoginMechanism.UsernamePassword) && !this.hasTokenLogin;

      if (this.hasTokenLogin) {
        this.headerLabelService.headerLabel = '';
      } else {
        this.headerLabelService.headerLabel = 'component.login.login';
      }

      if (!this.hasTokenLogin && !this.hasUsernamePasswordLogin) {
        this.router.navigate(['/']);
      }
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public async login(method: string): Promise<void> {
    this._authorizationFailed = false;
    let authenticated = false;
    this.isLoggingIn = method;

    this.username = this.username.trim();
    this.password = this.password.trim();
    this.token = this.token.trim();

    if (this.hasTokenLogin && this.token) {
      const tokenHash = this.userService.hashToken(this.token);
      authenticated = await this.userService.authenticateThroughLoginToken(tokenHash);

    } else if (this.hasUsernamePasswordLogin && this.username && this.password) {
      const passwordHash = this.userService.hashPassword(this.username, this.password);
      authenticated = await this.userService.authenticateThroughLogin(this.username.toLowerCase(), passwordHash);
    }

    if (authenticated) {
      this.storageServie.db.initialized.pipe(takeUntil(this._destroy)).subscribe(value => {
        this.isLoggingIn = null;
        this.router.navigateByUrl(this.return);
      });
    } else {
      this._authorizationFailed = true;
      this.isLoggingIn = null;
    }
  }
}
