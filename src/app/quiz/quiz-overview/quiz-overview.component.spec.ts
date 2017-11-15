import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizOverviewComponent} from './quiz-overview.component';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizOverviewComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
