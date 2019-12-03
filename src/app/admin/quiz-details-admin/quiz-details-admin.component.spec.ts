import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractQuestionEntity } from '../../lib/entities/question/AbstractQuestionEntity';
import { SurveyQuestionEntity } from '../../lib/entities/question/SurveyQuestionEntity';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { UserService } from '../../service/user/user.service';
import { QuizDetailsAdminComponent } from './quiz-details-admin.component';

describe('QuizDetailsAdminComponent', () => {
  let component: QuizDetailsAdminComponent;
  let fixture: ComponentFixture<QuizDetailsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: FooterBarService,
          useValue: {
            replaceFooterElements: () => {},
          },
        }, {
          provide: UserService,
          useValue: {},
        },
      ],
      declarations: [QuizDetailsAdminComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select "general" as default viewed info tab', () => {
    expect(component['_isSelected']).toEqual('general');
  });

  it('should select "questions" as currently viewed info tab', () => {
    component.select('questions');
    expect(component['_isSelected']).toEqual('questions');
  });

  it('should should check if a value is set (not null or undefined)', () => {
    expect(component.isSet(null)).toBeFalsy();
    expect(component.isSet(undefined)).toBeFalsy();
    expect(component.isSet(0)).toBeTruthy();
    expect(component.isSet('')).toBeTruthy();
    expect(component.isSet(true)).toBeTruthy();
  });

  it('should convert the type of a question to a SurveyQuestion', () => {
    const question = {} as AbstractQuestionEntity;
    expect(component.getQuestionAsSurvey(question)).toEqual(question as unknown as SurveyQuestionEntity);
  });
});
