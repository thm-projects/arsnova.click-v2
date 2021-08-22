import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { I18nTestingModule } from '../testing/i18n-testing/i18n-testing.module';

import { NoDataErrorComponent } from './no-data-error.component';

describe('NoDataErrorComponent', () => {
  let component: NoDataErrorComponent;
  let fixture: ComponentFixture<NoDataErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, RouterTestingModule],
      declarations: [NoDataErrorComponent],
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
