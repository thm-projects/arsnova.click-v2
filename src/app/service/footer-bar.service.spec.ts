import {async, inject, TestBed} from '@angular/core/testing';

import {FooterBarService} from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [FooterBarService]
    });
  }));

  it('should be created', async(inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  })));
});
