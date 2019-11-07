import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../_mocks/TranslateServiceMock';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { VotingQuestionComponent } from './voting-question/voting-question.component';

import { VotingComponent } from './voting.component';

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, FontAwesomeModule, HttpClientTestingModule, NgbModalModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, FooterBarService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, MemberApiService, QuizApiService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, SimpleMQ, QuestionTextService, HeaderLabelService,
      ],
      declarations: [VotingComponent, VotingQuestionComponent, ServerUnavailableModalComponent, TranslatePipeMock],
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ServerUnavailableModalComponent] } }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(VotingComponent.TYPE).toEqual('VotingComponent');
  }));

});
