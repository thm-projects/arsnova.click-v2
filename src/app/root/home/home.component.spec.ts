import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ModalsModule } from '../../modals/modals.module';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { AttendeeMockService } from '../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { CasService } from '../../service/cas/cas.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { SettingsMockService } from '../../service/settings/settings.mock.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';

import { HomeComponent } from './home.component';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
        ModalsModule,
        NgbModule.forRoot(),
      ],
      providers: [
        FooterBarService,
        { provide: SettingsService, useClass: SettingsMockService },
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        HeaderLabelService,
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        { provide: ThemesService, useClass: ThemesMockService },
        I18nService,
        { provide: AttendeeService, useClass: AttendeeMockService },
        CasService,
        UserService,
        { provide: TrackingService, useClass: TrackingMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
      ],
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach((() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    backend.verify();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();

    backend.expectOne(`./assets/i18n/de.json`).flush({});
  });

  it('should contain a TYPE reference', (() => {
    expect(HomeComponent.TYPE).toEqual('HomeComponent');

    backend.expectOne(`./assets/i18n/de.json`).flush({});
  }));

  it('should render \'arsnova.click\' in the main view', () => {
    const compiled = fixture.debugElement.nativeElement;
    const mainText = compiled.querySelector('#arsnova-click-description').textContent.trim().replace(/\s*\n*/g, '');

    backend.expectOne(`./assets/i18n/de.json`).flush({});
    expect(mainText).toContain('arsnova.click');
  });

  describe('#sanitizeHTML', () => {

    it('should sanitize a given markup string', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const markup = '<div><span>TestMarkup</span></div>';

      spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(() => {});
      component.sanitizeHTML(markup);

      backend.expectOne(`./assets/i18n/de.json`).flush({});
      expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
    }));
  });

  fdescribe('#autoJoinToSession', () => {

    it('should join the session by click', async(() => {
      spyOn(document.getElementById('joinSession'), 'click').and.callFake(() => {});
      component.autoJoinToSession('testquiz').subscribe((value) => {
        console.log(value);
      }, () => {}, () => {

        backend.expectOne(`./assets/i18n/de.json`).flush({});
        backend.expectOne(`./assets/mathjax/example_3.svg`).flush({});
        backend.expectOne(`${DefaultSettings.httpApiEndpoint}/status/testquiz`).flush({});
        expect(document.getElementById('joinSession').click).toHaveBeenCalled();
      });
    }));
  });
});
