import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwPush } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCogs, faMobileAlt, faQuestion, faTags, faUserFriends, faUsers } from '@fortawesome/free-solid-svg-icons';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { CustomMarkdownService } from '../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../service/custom-markdown/CustomMarkdownServiceMock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { StatisticsComponent } from './statistics.component';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        I18nTestingModule,
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      declarations: [StatisticsComponent, TranslatePipeMock],
      providers: [
        { provide: SwPush, useValue: {} },
        { provide: CustomMarkdownService, useClass: CustomMarkdownServiceMock },
        RxStompService, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, SimpleMQ, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faUsers, faQuestion, faCogs, faTags, faUserFriends, faMobileAlt);
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
