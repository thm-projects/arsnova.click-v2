import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { ServerUnavailableModalComponent } from './server-unavailable-modal.component';

describe('ServerUnavailableModalComponent', () => {
  let component: ServerUnavailableModalComponent;
  let fixture: ComponentFixture<ServerUnavailableModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [HeaderLabelService],
      declarations: [ServerUnavailableModalComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerUnavailableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
