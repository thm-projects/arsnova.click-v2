import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressBarMultipleChoiceComponent} from './progress-bar-multiple-choice.component';

describe('ProgressBarMultipleChoiceComponent', () => {
  let component: ProgressBarMultipleChoiceComponent;
  let fixture: ComponentFixture<ProgressBarMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarMultipleChoiceComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
