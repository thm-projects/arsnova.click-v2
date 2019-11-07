import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../_mocks/TranslateServiceMock';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, FontAwesomeModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, HeaderLabelService, FooterBarService, SettingsService, {
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
      declarations: [CountdownComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', (() => {
    expect(CountdownComponent.TYPE).toEqual('CountdownComponent');
  }));

  xit('should update the countdown', inject([QuizService], (quizService: QuizService) => {
    const initValue = quizService.quiz.questionList[0].timer;
    const newValue = initValue + 10;

    component.updateCountdown(newValue);

    expect(quizService.quiz.questionList[0].timer).toEqual(newValue);
    expect(component.countdown).toEqual(newValue);
  }));
});
