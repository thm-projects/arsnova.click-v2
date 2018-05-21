import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../../lib/default.settings';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { SettingsService } from '../../../service/settings/settings.service';

import { ReadingConfirmationComponent } from './reading-confirmation.component';

describe('QuizFow: ReadingConfirmationComponent', () => {
  let component: ReadingConfirmationComponent;
  let fixture: ComponentFixture<ReadingConfirmationComponent>;
  let backend: HttpTestingController;

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
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: AttendeeService, useClass: AttendeeMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        QuestionTextService,
        HeaderLabelService,
        FooterBarService,
        SettingsService,
      ],
      declarations: [ReadingConfirmationComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReadingConfirmationComponent);
    backend = TestBed.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    backend.verify();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(ReadingConfirmationComponent.TYPE).toEqual('ReadingConfirmationComponent');
  }));

  it('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(() => {});
    component.sanitizeHTML(markup);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
  }));

  it('#confirmReading', async(inject(
    [Router],
    (router: Router) => {

      const readingConfirmationUrl = `${DefaultSettings.httpApiEndpoint}/member/reading-confirmation`;
      const readingConfirmationResponse = {};

      spyOn(router, 'navigate').and.callFake(() => {});

      component.confirmReading().subscribe(() => {
        backend.expectOne(readingConfirmationUrl).flush(readingConfirmationResponse);
        expect(router.navigate).toHaveBeenCalled();
      });
    })));
});
