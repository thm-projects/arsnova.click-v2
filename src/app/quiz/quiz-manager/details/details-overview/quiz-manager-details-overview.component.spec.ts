import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwPush } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { of } from 'rxjs';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../service/themes/themes.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { TwitterService } from '../../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizManagerDetailsOverviewComponent } from './quiz-manager-details-overview.component';

describe('QuizManagerDetailsOverviewComponent', () => {
  let component: QuizManagerDetailsOverviewComponent;
  let fixture: ComponentFixture<QuizManagerDetailsOverviewComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule, HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID],
            },
          }),
        ],
        providers: [
          RxStompService, SimpleMQ, {
            provide: StorageService,
            useClass: StorageServiceMock,
          }, HeaderLabelService, {
            provide: QuizService,
            useClass: QuizMockService,
          }, {
            provide: ThemesService,
            useClass: ThemesMockService
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of({
                get: () => 0,
              }),
              queryParamMap: of({
                get: () => 0,
              }),
            },
          }, SharedService, {
            provide: TrackingService,
            useClass: TrackingMockService,
          }, {
            provide: TwitterService,
            useClass: TwitterServiceMock,
          }, {
            provide: SwPush,
            useValue: {}
          }, {
            provide: HotkeysService,
            useValue: {
              add: () => {}
            }
          },
        ],
        declarations: [QuizManagerDetailsOverviewComponent],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(QuizManagerDetailsOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));

  it('should contain a TYPE reference', (
    () => {
      expect(QuizManagerDetailsOverviewComponent.TYPE).toEqual('QuizManagerDetailsOverviewComponent');
    }
  ));

  it('should track the details destination on click', inject([TrackingService], (trackingService: TrackingService) => {
    spyOn(trackingService, 'trackClickEvent').and.callThrough();
    component.trackDetailsTarget('question-text');
    expect(trackingService.trackClickEvent).toHaveBeenCalled();
  }));
});
