import {inject, TestBed} from '@angular/core/testing';

import {QrCodeService} from './qr-code.service';

describe('QrCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [QrCodeService]
                                   });
  });

  it('should be created', inject([QrCodeService], (service: QrCodeService) => {
    expect(service).toBeTruthy();
  }));
});
