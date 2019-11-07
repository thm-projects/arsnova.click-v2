import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/TranslateServiceMock';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { AnsweroptionsRangedComponent } from './answeroptions-ranged.component';

describe('AnsweroptionsRangedComponent', () => {
  let component: AnsweroptionsRangedComponent;
  let fixture: ComponentFixture<AnsweroptionsRangedComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
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
              get: () => 2,
            }),
          },
        }, SharedService,
      ],
      declarations: [AnsweroptionsRangedComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(AnsweroptionsRangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', (() => {
    expect(AnsweroptionsRangedComponent.TYPE).toEqual('AnsweroptionsRangedComponent');
  }));
});
