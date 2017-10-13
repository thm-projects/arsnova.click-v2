import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnsweroptionsComponent} from './answeroptions.component';

describe('AnsweroptionsComponent', () => {
  let component: AnsweroptionsComponent;
  let fixture: ComponentFixture<AnsweroptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AnsweroptionsComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweroptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
