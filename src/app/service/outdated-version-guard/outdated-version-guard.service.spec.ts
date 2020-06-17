import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OutdatedVersionGuardService } from './outdated-version-guard.service';

describe('OutdatedVersionGuardService', () => {
  let service: OutdatedVersionGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OutdatedVersionGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
