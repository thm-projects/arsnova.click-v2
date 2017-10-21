import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestiontextComponent} from './questiontext.component';

describe('QuestiontextComponent', () => {
  let component: QuestiontextComponent;
  let fixture: ComponentFixture<QuestiontextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestiontextComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestiontextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
