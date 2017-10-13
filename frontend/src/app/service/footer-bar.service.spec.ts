import {inject, TestBed} from '@angular/core/testing';

import {FooterBarService} from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [FooterBarService]
                                   });
  });

  it('should be created', inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  }));
});
