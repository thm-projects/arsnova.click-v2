import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../service/custom-markdown/CustomMarkdownServiceMock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';
import { WordCloudComponent } from '../../../shared/word-cloud/word-cloud.component';

import { QuizPoolOverviewComponent } from './quiz-pool-overview.component';

describe('QuizPoolOverviewComponent', () => {
  let component: QuizPoolOverviewComponent;
  let fixture: ComponentFixture<QuizPoolOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule, ReactiveFormsModule,
        NgbPopoverModule,
        HttpClientTestingModule, I18nTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, SimpleMQ, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FormBuilder, {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [QuizPoolOverviewComponent, WordCloudComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPoolOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
