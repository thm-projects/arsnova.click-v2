import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {QuizJoinComponent} from './quiz-join.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {CasService} from '../../service/cas.service';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {ThemesService} from '../../service/themes.service';
import {UserService} from '../../service/user.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from '../../service/footer-bar.service';
import {SettingsService} from '../../service/settings.service';
import {ConnectionService} from '../../service/connection.service';
import {WebsocketService} from '../../service/websocket.service';
import {SharedService} from '../../service/shared.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

class MockRouter {
  queryParams = {
    subscribe: () => Math.random()
  };
  params = {
    subscribe: () => {
      return {
        quizName: 'test'
      };
    }
  };
}

describe('QuizJoinComponent', () => {
  let component: QuizJoinComponent;
  let fixture: ComponentFixture<QuizJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          }
        })
      ],
      providers: [
        CasService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        ThemesService,
        UserService,
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ActivatedRoute, useClass: MockRouter},
        SharedService
      ],
      declarations: [ QuizJoinComponent ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      expect(component).toBeTruthy();
    }))
  );
});
