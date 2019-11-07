import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SimpleMQ } from 'ng2-simple-mq';
import { TOAST_CONFIG } from 'ngx-toastr';
import { of } from 'rxjs';
import { SwUpdateMock } from '../../../_mocks/SwUpdateMock';
import { TranslatePipeMock } from '../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { AdditionalDataComponent } from '../../footer/additional-data/additional-data.component';
import { FooterBarComponent } from '../../footer/footer-bar/footer-bar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';
import { UserService } from '../../service/user/user.service';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), RouterTestingModule, HttpClientTestingModule, NgbModule, AngularSvgIconModule, FontAwesomeModule,
      ],
      providers: [
        {
          provide: UserService,
          useValue: { loadConfig: () => {} },
        }, HeaderLabelService, ThemesService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, I18nService, FileUploadService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: SwUpdate,
          useClass: SwUpdateMock,
        }, {
          provide: UpdateCheckService,
          useValue: {
            checkForUpdates: () => of(null),
          },
        }, {
          provide: TOAST_CONFIG,
          useValue: {
            default: {},
            config: {},
          },
        }, RxStompService, SimpleMQ,
      ],
      declarations: [
        HeaderComponent, FooterBarComponent, RootComponent, AdditionalDataComponent, TranslatePipeMock,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', () => {
    expect(RootComponent.TYPE).toEqual('RootComponent');
  });
});
