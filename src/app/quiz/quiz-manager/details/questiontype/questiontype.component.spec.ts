import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../_mocks/TranslateServiceMock';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { IndexedDbService } from '../../../../service/storage/indexed.db.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { QuestiontypeComponent } from './questiontype.component';

describe('QuestiontypeComponent', () => {
  let component: QuestiontypeComponent;
  let fixture: ComponentFixture<QuestiontypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
          },
        }, SharedService,
      ],
      declarations: [QuestiontypeComponent, TranslatePipeMock],
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
  it('should contain a TYPE reference', async(() => {
    expect(QuestiontypeComponent.TYPE).toEqual('QuestiontypeComponent');
  }));

  xdescribe('#isActiveQuestionType', () => {
    it('should return true if the current question type matches the input', () => {
      expect(component.isActiveQuestionType('SingleChoiceQuestion')).toBeTruthy();
    });
    it('should return false if the current question type does not match the input', () => {
      expect(component.isActiveQuestionType('SurveyQuestion')).toBeFalsy();
    });
  });

  xdescribe('#morphToQuestionType', () => {
    it('should convert the current question type to a new one', inject([QuizService], (quizService: QuizService) => {
      const targetType = 'MultipleChoiceQuestion';
      component.morphToQuestionType(QuestionType.MultipleChoiceQuestion);
      expect(quizService.quiz.questionList[0].TYPE).toEqual(targetType);
    }));
    it('should not convert the current question type if the passed type does not exist', inject([QuizService], (quizService: QuizService) => {
      const targetType = 'NotExistingType';
      const initType = quizService.quiz.questionList[0].TYPE;
      component.morphToQuestionType(QuestionType.MultipleChoiceQuestion);
      expect(quizService.quiz.questionList[0].TYPE).not.toEqual(targetType);
      expect(quizService.quiz.questionList[0].TYPE).not.toEqual(initType);
      expect(quizService.quiz.questionList[0].TYPE).toEqual(QuestionType.MultipleChoiceQuestion);
    }));
  });
});
