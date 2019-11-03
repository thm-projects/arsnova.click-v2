import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DbState, LoginMechanism } from '../../../lib/enums/enums';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'LoginComponent';
  public username = '';
  public password = '';
  public token = '';
  public hasUsernamePasswordLogin: boolean = environment.loginMechanism.includes(LoginMechanism.UsernamePassword);
  public hasTokenLogin: boolean = environment.loginMechanism.includes(LoginMechanism.Token);
  public hasMultipleLoginMethods: boolean = environment.loginMechanism.length > 1;

  private _authorizationFailed = false;

  get authorizationFailed(): boolean {
    return this._authorizationFailed;
  }

  private _isLoading = true;

  get isLoading(): boolean {
    return this._isLoading;
  }

  private return = '';

  private readonly _destroy = new Subject();

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private footerBarService: FooterBarService, private indexedDbService: IndexedDbService,
  ) {
    this.userService.logout();
    this.headerLabelService.headerLabel = 'component.login.login';
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
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public async login(): Promise<void> {
    this._authorizationFailed = false;
    let isLoggedIn = false;

    if (this.hasTokenLogin && this.token) {
      const tokenHash = this.userService.hashToken(this.token);
      isLoggedIn = await this.userService.authenticateThroughLoginToken(tokenHash);

    } else if (this.hasUsernamePasswordLogin && this.username && this.password) {
      const passwordHash = this.userService.hashPassword(this.username, this.password);
      isLoggedIn = await this.userService.authenticateThroughLogin(this.username.toLowerCase(), passwordHash);
    }

    if (isLoggedIn) {
      this.indexedDbService.stateNotifier.pipe(takeUntil(this._destroy)).subscribe(value => {
        if (value === DbState.Initialized) {
          this.router.navigateByUrl(this.return);
        }
      });
    } else {
      this._authorizationFailed = true;
    }
  }
}
