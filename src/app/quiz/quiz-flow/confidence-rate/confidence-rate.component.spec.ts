import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subscription } from 'rxjs';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TwitterService } from '../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../service/twitter/twitter.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';
import { ConfidenceRateComponent } from './confidence-rate.component';

describe('QuizFlow: ConfidenceRateComponent', () => {
  let component: ConfidenceRateComponent;
  let fixture: ComponentFixture<ConfidenceRateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }), HttpClientTestingModule,
      ],
      providers: [
        RxStompService, SimpleMQ, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, HeaderLabelService, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SharedService, SettingsService, MemberApiService, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [ConfidenceRateComponent, ServerUnavailableModalComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ConfidenceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', waitForAsync(() => {
    expect(ConfidenceRateComponent.TYPE).toEqual('ConfidenceRateComponent');
  }));

  it('#getConfidenceLevel', waitForAsync(() => {
    expect(component.getConfidenceLevelTranslation()).toEqual('component.voting.confidence_level.very_sure');
  }));

  it('#sendConfidence', waitForAsync(() => {
    spyOn(component, 'sendConfidence').and.callFake(() => new Promise<Subscription>(resolve => resolve()));

    component.sendConfidence();

    expect(component.sendConfidence).not.toThrowError();
  }));

});
