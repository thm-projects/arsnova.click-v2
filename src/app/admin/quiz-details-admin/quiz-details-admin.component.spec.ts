import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDetailsAdminComponent } from './quiz-details-admin.component';

describe('QuizDetailsAdminComponent', () => {
  let component: QuizDetailsAdminComponent;
  let fixture: ComponentFixture<QuizDetailsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizDetailsAdminComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
