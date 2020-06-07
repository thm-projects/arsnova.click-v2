import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizTypeSelectModalComponent } from './quiz-type-select-modal.component';

@Pipe({
  name: 'genericFilter',
})
export class GenericFilterPipeMock implements PipeTransform {
  public transform(value: any, ...args): any {
    return value;
  }
}

describe('QuizTypeSelectModalComponent', () => {
  let component: QuizTypeSelectModalComponent;
  let fixture: ComponentFixture<QuizTypeSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, FormsModule],
      providers: [
        NgbActiveModal,
      ],
      declarations: [QuizTypeSelectModalComponent, GenericFilterPipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTypeSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
