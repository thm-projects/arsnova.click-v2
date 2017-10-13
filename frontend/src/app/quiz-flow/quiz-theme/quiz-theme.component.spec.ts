import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizThemeComponent} from './quiz-theme.component';

describe('QuizThemeComponent', () => {
  let component: QuizThemeComponent;
  let fixture: ComponentFixture<QuizThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizThemeComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
