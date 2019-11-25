import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeMock } from '../../../_mocks/TranslatePipeMock';

import { NoDataErrorComponent } from './no-data-error.component';

describe('NoDataErrorComponent', () => {
  let component: NoDataErrorComponent;
  let fixture: ComponentFixture<NoDataErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NoDataErrorComponent, TranslatePipeMock],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close: () => {},
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
