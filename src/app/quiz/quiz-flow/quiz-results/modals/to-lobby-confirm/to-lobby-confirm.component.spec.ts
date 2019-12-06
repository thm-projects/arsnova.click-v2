import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/_services/TranslateServiceMock';

import { ToLobbyConfirmComponent } from './to-lobby-confirm.component';

describe('ToLobbyConfirmComponent', () => {
  let component: ToLobbyConfirmComponent;
  let fixture: ComponentFixture<ToLobbyConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, NgbActiveModal,
      ],
      declarations: [ToLobbyConfirmComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToLobbyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
