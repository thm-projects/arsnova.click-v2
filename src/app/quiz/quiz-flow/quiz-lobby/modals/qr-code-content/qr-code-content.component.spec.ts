import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeContentComponent } from './qr-code-content.component';

describe('QrCodeContentComponent', () => {
  let component: QrCodeContentComponent;
  let fixture: ComponentFixture<QrCodeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeContentComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
