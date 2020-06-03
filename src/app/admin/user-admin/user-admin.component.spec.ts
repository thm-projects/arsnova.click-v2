import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { Observable, of } from 'rxjs';
import { UserMock } from '../../../_mocks/_fixtures/user.mock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { AdminApiService } from '../../service/api/admin/admin-api.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
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
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { UserAdminComponent } from './user-admin.component';

describe('UserAdminComponent', () => {
  let component: UserAdminComponent;
  let fixture: ComponentFixture<UserAdminComponent>;
  const newUser = {
    ...UserMock,
    name: 'new-user-name',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        RxStompService, I18nService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, ThemesService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: UserService,
          useValue: {
            hashPassword: () => 'hashed-password',
          },
        }, JwtHelperService, {
          provide: AdminApiService,
          useValue: {
            getAvailableUsers: () => of([JSON.parse(JSON.stringify(UserMock))]),
            deleteUser: () => new Observable(subscriber => {
              subscriber.next();
              subscriber.complete();
            }),
            updateUser: () => new Observable(subscriber => {
              subscriber.next();
              subscriber.complete();
            }),
          },
        }, {
          provide: NgbModal,
          useValue: {
            open: () => (
              {
                componentInstance: {},
                result: new Promise(resolve => resolve(JSON.parse(JSON.stringify(newUser)))),
              }
            ),
          },
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [
        UserAdminComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should check if a user is currently deleted', async(() => {
    expect(component.isDeletingElem(JSON.parse(JSON.stringify(UserMock)))).toBeFalsy();
    component['_deletingElements'].push(JSON.parse(JSON.stringify(UserMock)).name);
    expect(component.isDeletingElem(JSON.parse(JSON.stringify(UserMock)))).toBeTruthy();
  }));

  it('should delete a given user by name', async(() => {
    component.deleteElem(JSON.parse(JSON.stringify(UserMock)));
    expect(component.data).not.toContain(JSON.parse(JSON.stringify(UserMock)));
  }));

  it('should show the adduser modal', () => {
    of(component.showAddUserModal).subscribe(() => {
      expect(component.data).toBeTruthy();
    });
  });
});
