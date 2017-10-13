import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressBarRangedComponent} from './progress-bar-ranged.component';

describe('ProgressBarRangedComponent', () => {
  let component: ProgressBarRangedComponent;
  let fixture: ComponentFixture<ProgressBarRangedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [ProgressBarRangedComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarRangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
