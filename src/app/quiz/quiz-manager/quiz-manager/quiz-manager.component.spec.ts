import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizManagerComponent} from './quiz-manager.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ConnectionService} from '../../../service/connection.service';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SettingsService} from '../../../service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from '../../../service/footer-bar.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SharedService} from '../../../service/shared.service';
import {WebsocketService} from '../../../service/websocket.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {TrackingService} from '../../../service/tracking.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../../service/tracking.mock.service';
import {FooterModule} from '../../../footer/footer.module';

describe('QuizManagerComponent', () => {
  let component: QuizManagerComponent;
  let fixture: ComponentFixture<QuizManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FooterModule,
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
        }),
      ],
      providers: [
        HeaderLabelService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
      ],
      declarations: [QuizManagerComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
