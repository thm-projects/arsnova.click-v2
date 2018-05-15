import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestiontypeComponent} from './questiontype.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {ConnectionService} from '../../../../service/connection.service';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {SharedService} from '../../../../service/shared.service';
import {SettingsService} from '../../../../service/settings.service';
import {WebsocketService} from '../../../../service/websocket.service';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {ActivatedRoute} from '@angular/router';

class MockRouter {
  params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0
      });
    }
  };
}

describe('QuestiontypeComponent', () => {
  let component: QuestiontypeComponent;
  let fixture: ComponentFixture<QuestiontypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
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
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ActivatedRoute, useClass: MockRouter},
        SharedService,
      ],
      declarations: [QuestiontypeComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuestiontypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
