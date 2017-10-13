import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnsweroptionsFreetextComponent} from './answeroptions-freetext.component';

describe('AnsweroptionsFreetextComponent', () => {
  let component: AnsweroptionsFreetextComponent;
  let fixture: ComponentFixture<AnsweroptionsFreetextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AnsweroptionsFreetextComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweroptionsFreetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
