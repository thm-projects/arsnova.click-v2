import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingQuestionComponent } from './voting-question.component';

describe('VotingQuestionComponent', () => {
  let component: VotingQuestionComponent;
  let fixture: ComponentFixture<VotingQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VotingQuestionComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
