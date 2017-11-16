import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizJoinComponent} from './quiz-join.component';

describe('QuizJoinComponent', () => {
  let component: QuizJoinComponent;
  let fixture: ComponentFixture<QuizJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
