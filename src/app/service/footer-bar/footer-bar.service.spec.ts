import { async, inject, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';

import { FooterBarService } from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      providers: [FooterBarService],
    });
  }));

  it('should be created', async(inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  })));
});
