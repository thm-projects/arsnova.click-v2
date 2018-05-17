import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizRenameComponent} from './quiz-rename.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FileUploadService} from '../../service/file-upload.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {ConnectionService} from '../../service/connection.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {SharedService} from '../../service/shared.service';
import {SettingsService} from '../../service/settings.service';
import {WebsocketService} from '../../service/websocket.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';

describe('QuizRenameComponent', () => {
  let component: QuizRenameComponent;
  let fixture: ComponentFixture<QuizRenameComponent>;

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
        FileUploadService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
      ],
      declarations: [QuizRenameComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
