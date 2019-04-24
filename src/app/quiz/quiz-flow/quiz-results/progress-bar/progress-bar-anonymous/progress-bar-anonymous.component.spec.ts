import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarAnonymousComponent } from './progress-bar-anonymous.component';

describe('ProgressBarAnonymousComponent', () => {
  let component: ProgressBarAnonymousComponent;
  let fixture: ComponentFixture<ProgressBarAnonymousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarAnonymousComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarAnonymousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
