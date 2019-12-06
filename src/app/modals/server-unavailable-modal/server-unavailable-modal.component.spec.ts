import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { HeaderLabelService } from '../../service/header-label/header-label.service';

import { ServerUnavailableModalComponent } from './server-unavailable-modal.component';

describe('ServerUnavailableModalComponent', () => {
  let component: ServerUnavailableModalComponent;
  let fixture: ComponentFixture<ServerUnavailableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderLabelService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
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
