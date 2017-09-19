import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AvailableQuizzesComponent} from './available-quizzes.component';

describe('AvailableQuizzesComponent', () => {
  let component: AvailableQuizzesComponent;
  let fixture: ComponentFixture<AvailableQuizzesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableQuizzesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
