import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnsweroptionsRangedComponent} from './answeroptions-ranged.component';

describe('AnsweroptionsRangedComponent', () => {
  let component: AnsweroptionsRangedComponent;
  let fixture: ComponentFixture<AnsweroptionsRangedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AnsweroptionsRangedComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweroptionsRangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
