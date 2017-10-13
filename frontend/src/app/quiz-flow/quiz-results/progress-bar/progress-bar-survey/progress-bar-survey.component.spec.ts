import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarSurveyComponent } from './progress-bar-survey.component';

describe('ProgressBarSurveyComponent', () => {
  let component: ProgressBarSurveyComponent;
  let fixture: ComponentFixture<ProgressBarSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
