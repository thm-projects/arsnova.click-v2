import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTypeSelectModalComponent } from './quiz-type-select-modal.component';

describe('QuizTypeSelectModalComponent', () => {
  let component: QuizTypeSelectModalComponent;
  let fixture: ComponentFixture<QuizTypeSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizTypeSelectModalComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTypeSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
