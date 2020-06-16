import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { AnswerResultComponent } from './answer-result.component';

describe('AnswerResultComponent', () => {
  let component: AnswerResultComponent;
  let fixture: ComponentFixture<AnswerResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, I18nTestingModule],
      providers: [
        RxStompService, SimpleMQ, FooterBarService,
        {provide: QuizService, useClass: QuizMockService},
        {provide: AttendeeService, useClass: AttendeeMockService},
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
