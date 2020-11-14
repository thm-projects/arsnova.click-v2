import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { AnswerResultComponent } from './answer-result.component';

describe('AnswerResultComponent', () => {
  let component: AnswerResultComponent;
  let fixture: ComponentFixture<AnswerResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, I18nTestingModule,
        NgbModalModule,
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, SimpleMQ, FooterBarService, TransferState,
        {provide: QuizService, useClass: QuizMockService},
        {provide: AttendeeService, useClass: AttendeeMockService},
        {provide: CustomMarkdownService, useClass: CustomMarkdownServiceMock},
        {provide: HotkeysService, useValue: {}},
        {provide: ToastrService, useValue: {}},
      ],
      declarations: [ AnswerResultComponent, TranslatePipeMock ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
