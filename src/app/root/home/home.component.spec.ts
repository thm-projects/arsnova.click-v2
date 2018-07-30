import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ModalsModule } from '../../modals/modals.module';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { AttendeeMockService } from '../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { SettingsMockService } from '../../service/settings/settings.mock.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [StorageService],
          },
        }), SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        }), ModalsModule, NgbModule.forRoot(),
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, {
          provide: SettingsService,
          useClass: SettingsMockService,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, HeaderLabelService, {
          provide: ActiveQuestionGroupService,
          useClass: ActiveQuestionGroupMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, I18nService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, CasLoginService, UserService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: FileUploadService,
          useClass: FileUploadMockService,
        },
      ],
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach((
    () => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', (
    () => {
      expect(HomeComponent.TYPE).toEqual('HomeComponent');
    }
  ));

  it('should render \'arsnova.click\' in the main view', () => {
    const compiled = fixture.debugElement.nativeElement;
    const mainText = compiled.querySelector('#arsnova-click-description').textContent.trim().replace(/\s*\n*/g, '');

    expect(mainText).toContain('arsnova.click');
  });

  describe('#sanitizeHTML', () => {

    it('should sanitize a given markup string', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const markup = '<div><span>TestMarkup</span></div>';

      spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(() => {});
      component.sanitizeHTML(markup);

      expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
    }));
  });

  describe('#autoJoinToSession', () => {

    it('should join the session by click', async(inject([Router], (router: Router) => {
      spyOn(component, 'selectQuizByList').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => {});

      component.autoJoinToSession('testquiz');
      expect(component.selectQuizByList).toHaveBeenCalled();
    })));
  });
});
