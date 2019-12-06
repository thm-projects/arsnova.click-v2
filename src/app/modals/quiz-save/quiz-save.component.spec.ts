import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';

import { QuizSaveComponent } from './quiz-save.component';

describe('QuizSaveComponent', () => {
  let component: QuizSaveComponent;
  let fixture: ComponentFixture<QuizSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [NgbActiveModal],
      declarations: [QuizSaveComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
