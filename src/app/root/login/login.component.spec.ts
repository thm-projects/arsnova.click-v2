import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { UserService } from '../../service/user/user.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [HeaderLabelService, FooterBarService, UserService],
      declarations: [LoginComponent],
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

  describe('#trySubmit', () => {
    it('should submit the login request if the username and password have been given and the enter key was pressed', () => {
      const event = { keyCode: 13 };
      const username = 'testuser';
      const password = 'testpassword';

      spyOn(component, 'login').and.callFake(() => {});
      component['username'] = username;
      component['password'] = password;

      component.trySubmit(event);

      expect(component.login).toHaveBeenCalled();
    });

    it('should not submit the login if the username or password fields are emtpy', () => {
      const event = { keyCode: 13 };
      const username = '';
      const password = '';

      spyOn(component, 'login').and.callFake(() => {});
      component['username'] = username;
      component['password'] = password;

      component.trySubmit(event);

      expect(component.login).not.toHaveBeenCalled();
    });

    it('should not submit the login if any key except the enter key is pressed', () => {
      const event = { keyCode: 42 };
      const username = 'testuser';
      const password = 'testpassword';

      spyOn(component, 'login').and.callFake(() => {});
      component['username'] = username;
      component['password'] = password;

      component.trySubmit(event);

      expect(component.login).not.toHaveBeenCalled();
    });
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
        spyOn(router, 'navigateByUrl').and.callFake(() => {});

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
        spyOn(router, 'navigateByUrl').and.callFake(() => {});

        await component.login();
        expect(component['_authorizationFailed']).toBeTruthy();
      }));
  });
});
