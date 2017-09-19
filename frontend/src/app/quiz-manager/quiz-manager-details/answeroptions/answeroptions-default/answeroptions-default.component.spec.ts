import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnsweroptionsDefaultComponent} from './answeroptions-default.component';

describe('AnsweroptionsDefaultComponent', () => {
  let component: AnsweroptionsDefaultComponent;
  let fixture: ComponentFixture<AnsweroptionsDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnsweroptionsDefaultComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweroptionsDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
