import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReadingConfirmationComponent} from './reading-confirmation.component';
import {ConnectionService} from '../../../service/connection.service';
import {AttendeeService} from '../../../service/attendee.service';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {QuestionTextService} from '../../../service/question-text.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SettingsService} from '../../../service/settings.service';
import {AttendeeMockService} from '../../../service/attendee.mock.service';

describe('QuizFow: ReadingConfirmationComponent', () => {
  let component: ReadingConfirmationComponent;
  let fixture: ComponentFixture<ReadingConfirmationComponent>;

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
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: AttendeeService, useClass: AttendeeMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        QuestionTextService,
        HeaderLabelService,
        FooterBarService,
        SettingsService,
      ],
      declarations: [ ReadingConfirmationComponent ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReadingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
