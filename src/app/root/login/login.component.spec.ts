import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { TranslatePipeMock } from '../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), FormsModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        RxStompService,
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, FooterBarService, {
          provide: UserService,
          useValue: {
            logout: () => {},
            authenticateThroughLogin: () => new Promise(resolve => resolve()),
            hashPassword: () => '8c430f5e2df2fdd422c4719b884e9d525110fcf5',
          },
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [LoginComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', () => {
    expect(LoginComponent.TYPE).toEqual('LoginComponent');
  });

  describe('#login', () => {
    it('should submit the login request if the username and password are valid',
      inject([UserService, Router], async (userService: UserService, router: Router) => {
        const expectedHash = '8c430f5e2df2fdd422c4719b884e9d525110fcf5'; // hash for testuser:testpassword
        const username = 'testuser';
        const password = 'testpassword';

        component['username'] = username;
        component['password'] = password;
        spyOn(userService, 'authenticateThroughLogin').and.returnValue(new Promise(resolve => resolve(true)));
        spyOn(router, 'navigateByUrl').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

        await component.login();
        expect(component['_authorizationFailed']).toBeFalsy();

      }));

    it('should not submit the login request if the username and password are invalid',
      inject([UserService, Router], async (userService: UserService, router: Router) => {
        const expectedHash = '8c430f5e2df2fdd422c4719b884e9d525110fcf5'; // hash for testuser:testpassword
        const username = 'testuser';
        const password = 'testpassword';

        component['username'] = username;
        component['password'] = password;
        spyOn(userService, 'authenticateThroughLogin').and.returnValue(new Promise(resolve => resolve(false)));
        spyOn(router, 'navigateByUrl').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

        await component.login();
        expect(component['_authorizationFailed']).toBeTruthy();
      }));
  });
});
