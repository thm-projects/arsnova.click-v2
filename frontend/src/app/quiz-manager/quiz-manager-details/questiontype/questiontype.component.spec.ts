import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestiontypeComponent} from './questiontype.component';

describe('QuestiontypeComponent', () => {
  let component: QuestiontypeComponent;
  let fixture: ComponentFixture<QuestiontypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [QuestiontypeComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestiontypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
