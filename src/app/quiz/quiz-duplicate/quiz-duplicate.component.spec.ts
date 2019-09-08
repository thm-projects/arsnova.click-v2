import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDuplicateComponent } from './quiz-duplicate.component';

describe('QuizDuplicateComponent', () => {
  let component: QuizDuplicateComponent;
  let fixture: ComponentFixture<QuizDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizDuplicateComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
