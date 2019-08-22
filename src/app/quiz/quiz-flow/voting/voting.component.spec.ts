import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../shared/shared.module';

import { VotingComponent } from './voting.component';

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        IndexedDbService, {
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
        }, MemberApiService, QuizApiService,
      ],
      declarations: [VotingComponent],
    }).compileComponents();
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

  describe('#sanitizeHTML', () => {
    it('should sanitize HTML', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#displayAnswerButtons', () => {
    it('should return true if it displays the answer buttons', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#displayRangedButtons', () => {
    it('should return true if it displays the ranged answer input fields', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#displayFreetextInput', () => {
    it('should return true if it displays the freetext answer input fields', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#normalizeAnswerOptionIndex', () => {
    it('should return the character from A-Z matching the answeroption number', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#isSelected', () => {
    it('should return true if a given answer is selected', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#parseTextInput', () => {
    it('should return a given text input', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#parseNumberInput', () => {
    it('should return a given number input', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#isNumber', () => {
    it('should return true if a given value is a number', async(() => {
      expect(component).toBeTruthy();
    }));
  });

  describe('#showSendResponseButton', () => {
    it('should return true if button to submit the responses is visible', async(() => {
      expect(component).toBeTruthy();
    }));
  });
});
