import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizRenameComponent } from './quiz-rename.component';

describe('QuizRenameComponent', () => {
  let component: QuizRenameComponent;
  let fixture: ComponentFixture<QuizRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
