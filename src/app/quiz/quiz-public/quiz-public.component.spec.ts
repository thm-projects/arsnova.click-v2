import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPublicComponent } from './quiz-public.component';

describe('QuizPublicComponent', () => {
  let component: QuizPublicComponent;
  let fixture: ComponentFixture<QuizPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
