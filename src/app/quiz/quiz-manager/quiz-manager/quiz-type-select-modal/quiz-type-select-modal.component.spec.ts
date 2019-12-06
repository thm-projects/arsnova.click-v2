import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../_mocks/_services/TranslateServiceMock';
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
      imports: [FormsModule],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, NgbActiveModal,
      ],
      declarations: [QuizTypeSelectModalComponent, TranslatePipeMock, GenericFilterPipeMock],
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
