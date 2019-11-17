import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { DbState, StorageKey } from '../../lib/enums/enums';
import { StatusProtocol } from '../../lib/enums/Message';
import { UserRole } from '../../lib/enums/UserRole';
import { ILoginSerialized } from '../../lib/interfaces/ILoginSerialized';
import { AuthorizeApiService } from '../api/authorize/authorize-api.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _isLoggedIn: boolean;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    if (!value) {
      this._casTicket = null;
      this._staticLoginToken = null;
      this._staticLoginTokenContent = null;
      this._username = null;
      this.deleteTokens();
    } else {
      this._staticLoginTokenContent = this.decodeToken();
      this._username = this._staticLoginTokenContent.name;
      this.persistTokens();
    }
    if (isPlatformBrowser(this.platformId)) {
      console.log(`UserService: switching db to user ${this.username} - isLoggedIn: ${value}`);
      this._destroy.next();
      this.storageService.switchDb(this._username).pipe(takeUntil(this._destroy)).subscribe(() => {
        this._isLoggedIn = value;
        this._loginNotifier.next(value);
      });
    } else {
      this._isLoggedIn = value;
      this._loginNotifier.next(value);
    }
  }

  private _staticLoginTokenContent: ILoginSerialized;

  get staticLoginTokenContent(): ILoginSerialized {
    return this._staticLoginTokenContent;
  }

  private _loginNotifier = new ReplaySubject<boolean>(1);

  get loginNotifier(): ReplaySubject<boolean> {
    return this._loginNotifier;
  }

  private _casTicket: string;

  get casTicket(): string {
    return this._casTicket;
  }

  private _username: string;

  get username(): string {
    return this._username;
  }

  private _staticLoginToken: string;

  get staticLoginToken(): string {
    return this._staticLoginToken;
  }

  private readonly _destroy = new Subject();
  private _tmpRemoteQuizData: Array<any> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authorizeApiService: AuthorizeApiService,
    private storageService: StorageService,
    private jwtHelper: JwtHelperService,
    private quizService: QuizService,
  ) {

    this.storageService.stateNotifier.pipe(filter(type => this.username && type !== null && type !== DbState.Destroy)).subscribe((type) => {

      if (this._staticLoginTokenContent && this._staticLoginTokenContent.privateKey) {
        console.log('UserService: having static token content with private key');
        this.storageService.db.Config.put({
          type: StorageKey.PrivateKey,
          value: this._staticLoginTokenContent.privateKey,
        });
        sessionStorage.setItem(StorageKey.PrivateKey, this._staticLoginTokenContent.privateKey);

        if (this._tmpRemoteQuizData.length) {
          console.log('UserService: having remote quiz data');
          this.storageService.db.Quiz.toCollection().filter(localQuiz => !this._tmpRemoteQuizData.find(val => val.name === localQuiz.name))
          .each(localQuiz => {
            console.log('UserService: syncing local quiz data to server');
            this.quizService.persistQuiz(new QuizEntity(localQuiz));
          }).then(() => {
            this._tmpRemoteQuizData.forEach(quiz => {
              this.quizService.persistQuiz(new QuizEntity(quiz));
              console.log('UserService: persisting remote quiz to local db', quiz.name);
            });
          });
        } else {
          console.log('UserService: not received remote quiz data');
        }
      } else {
        console.log('UserService: not received any static login token content');
      }
    });

    this.loadConfig();
  }

  public logout(): void {
    this.isLoggedIn = false;
  }

  public decodeToken(): ILoginSerialized {
    if (!this.staticLoginToken) {
      return null;
    }

    return this.jwtHelper.decodeToken(this.staticLoginToken);
  }

  public authenticateThroughCas(token: string): Promise<boolean> {
    return new Promise(async resolve => {
      const data = await this.authorizeApiService.getAuthorizationForToken(token).toPromise();

      if (data.status === StatusProtocol.Success) {
        this._casTicket = data.payload.casTicket;
        this.isLoggedIn = true;
        resolve(true);
      } else {
        this.isLoggedIn = false;
        resolve(false);
      }
    });
  }

  public authenticateThroughLogin(username, passwordHash): Promise<boolean> {
    return new Promise(async resolve => {

      const data = await this.authorizeApiService.postAuthorizationForStaticLogin({
        username,
        passwordHash,
        token: this._staticLoginToken,
      }).toPromise().catch(() => resolve(false));

      if (!data) {
        return;
      }

      if (data.status === StatusProtocol.Success) {
        this._staticLoginToken = data.payload.token;
        this._tmpRemoteQuizData = data.payload.quizzes;
        this._username = username;
        this.isLoggedIn = true;
        resolve(true);
      } else {
        this.isLoggedIn = false;
        resolve(false);
      }
    });
  }

  public authenticateThroughLoginToken(tokenHash): Promise<boolean> {
    return new Promise(async resolve => {

      const data = await this.authorizeApiService.postAuthorizationForStaticLogin({
        tokenHash,
        token: this._staticLoginToken,
      }).toPromise().catch(() => resolve(false));

      if (!data) {
        return;
      }

      if (data.status === StatusProtocol.Success) {
        this._staticLoginToken = data.payload.token;
        this._tmpRemoteQuizData = data.payload.quizzes;
        this._username = data.payload.username;
        this.isLoggedIn = true;
        resolve(true);
      } else {
        this.isLoggedIn = false;
        resolve(false);
      }
    });
  }

  public hashPassword(username: string, password: string): string {
    return this.sha1(`${username}|${password}`);
  }

  public hashToken(token: string): string {
    return this.sha1(token);
  }

  public isAuthorizedFor(authorization: Array<UserRole>): boolean;

  public isAuthorizedFor(authorization: UserRole): boolean;

  public isAuthorizedFor(authorization: UserRole | Array<UserRole>): boolean {
    if (!this.staticLoginTokenContent) {
      return false;
    }

    if (!this.staticLoginTokenContent.userAuthorizations) {
      return false;
    }

    if (Array.isArray(authorization)) {
      return authorization.some(auth => {
        return this.staticLoginTokenContent.userAuthorizations.find(value => value === auth);
      });
    }

    return this.staticLoginTokenContent.userAuthorizations.includes(authorization);
  }

  private loadConfig(): boolean {
    if (isPlatformServer(this.platformId)) {
      this.isLoggedIn = false;
      return this.isLoggedIn;
    }

    this._staticLoginToken = sessionStorage.getItem(StorageKey.LoginToken);
    this._casTicket = sessionStorage.getItem(StorageKey.CasToken);

    if (!this._staticLoginToken) {
      this.isLoggedIn = false;
      return this.isLoggedIn;
    }

    this.isLoggedIn = !this.jwtHelper.isTokenExpired(this._staticLoginToken);
    return this.isLoggedIn;
  }

  private deleteTokens(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    sessionStorage.removeItem(StorageKey.LoginToken);
  }

  private persistTokens(): void {
    sessionStorage.setItem(StorageKey.LoginToken, this._staticLoginToken);
  }

  private rotl(n, s): number {
    return n << s | n >>> 32 - s;
  }

  private tohex(i2: number): string {
    for (let h = '', s = 28; ; s -= 4) {
      h += (i2 >>> s & 0xf).toString(16);
      if (!s) {
        return h;
      }
    }
  }

  private sha1(msg): string {
    let H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0;
    let i, t;
    const M = 0x0ffffffff, W = new Array(80), ml = msg.length, wa = [];
    msg += String.fromCharCode(0x80);
    while (msg.length % 4) {
      msg += String.fromCharCode(0);
    }
    for (i = 0; i < msg.length; i += 4) {
      wa.push(msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3));
    }
    while (wa.length % 16 !== 14) {
      wa.push(0);
    }
    wa.push(ml >>> 29);
    wa.push((ml << 3) & M);
    for (let bo = 0; bo < wa.length; bo += 16) {
      for (i = 0; i < 16; i++) {
        W[i] = wa[bo + i];
      }
      for (i = 16; i <= 79; i++) {
        W[i] = this.rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      }
      let A = H0, B = H1, C = H2, D = H3, E = H4;
      for (i = 0; i <= 19; i++) {
        t = (this.rotl(A, 5) + (B & C | ~B & D) + E + W[i] + 0x5A827999) & M, E = D, D = C, C = this.rotl(B, 30), B = A, A = t;
      }
      for (i = 20; i <= 39; i++) {
        t = (this.rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & M, E = D, D = C, C = this.rotl(B, 30), B = A, A = t;
      }
      for (i = 40; i <= 59; i++) {
        t = (this.rotl(A, 5) + (B & C | B & D | C & D) + E + W[i] + 0x8F1BBCDC) & M, E = D, D = C, C = this.rotl(B, 30), B = A, A = t;
      }
      for (i = 60; i <= 79; i++) {
        t = (this.rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & M, E = D, D = C, C = this.rotl(B, 30), B = A, A = t;
      }
      H0 = H0 + A & M;
      H1 = H1 + B & M;
      H2 = H2 + C & M;
      H3 = H3 + D & M;
      H4 = H4 + E & M;
    }
    return this.tohex(H0) + this.tohex(H1) + this.tohex(H2) + this.tohex(H3) + this.tohex(H4);
  }
}
