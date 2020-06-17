import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SwUpdateMock } from '../../../_mocks/_services/SwUpdateMock';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { OutdatedVersionComponent } from './outdated-version.component';

describe('OutdatedVersionComponent', () => {
  let component: OutdatedVersionComponent;
  let fixture: ComponentFixture<OutdatedVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [
        NgbActiveModal,
        {provide: SwUpdate, useClass: SwUpdateMock},
        {provide: ToastrService, useValue: {}},
      ],
      declarations: [ OutdatedVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdatedVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
