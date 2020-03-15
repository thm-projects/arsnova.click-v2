import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform, PLATFORM_ID, SecurityContext } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEdit, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { AttendeeMockService } from '../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsMockService } from '../../service/settings/settings.mock.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../service/twitter/twitter.service.mock';
import { UserService } from '../../service/user/user.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { TwitterCardsComponent } from '../twitter-cards/twitter-cards.component';
import { HomeComponent } from './home.component';

@Pipe({
  name: 'searchFilter',
})
class SearchFilterPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: string): Array<any> {
    return value;
  }
}

(
  window as any
).Modernizr = {};

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
            deps: [PLATFORM_ID, StorageService],
          },
        }), I18nTestingModule, RouterTestingModule, HttpClientTestingModule, NgbModule, FontAwesomeModule, FormsModule,
      ],
      providers: [
        RxStompService, SimpleMQ, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, {
          provide: SettingsService,
          useClass: SettingsMockService,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
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
          provide: FileUploadService,
          useClass: FileUploadMockService,
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock
        }
      ],
      declarations: [HomeComponent, TranslatePipeMock, SearchFilterPipeMock, TwitterCardsComponent],
    }).compileComponents();
  });

  beforeEach((
    () => {
      const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
      library.addIcons(...[faThumbsUp, faEdit, faTwitter]);
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

      spyOn(sanitizer, 'sanitize').and.callFake((ctx: SecurityContext, value: string) => value as string);
      component.sanitizeHTML(markup);

      expect(sanitizer.sanitize).toHaveBeenCalled();
    }));
  });

  describe('#autoJoinToSession', () => {

    it('should join the session by click', async(inject([Router], (router: Router) => {
      spyOn(component, 'selectQuizByList').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.autoJoinToSession('testquiz');
      expect(component.selectQuizByList).toHaveBeenCalled();
    })));
  });
});
