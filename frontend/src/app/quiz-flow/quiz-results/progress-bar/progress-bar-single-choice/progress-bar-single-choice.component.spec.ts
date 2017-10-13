import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarSingleChoiceComponent } from './progress-bar-single-choice.component';

describe('ProgressBarSingleChoiceComponent', () => {
  let component: ProgressBarSingleChoiceComponent;
  let fixture: ComponentFixture<ProgressBarSingleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarSingleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarSingleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
