import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarFreetextComponent } from './progress-bar-freetext.component';

describe('ProgressBarFreetextComponent', () => {
  let component: ProgressBarFreetextComponent;
  let fixture: ComponentFixture<ProgressBarFreetextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarFreetextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarFreetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
