import { TestBed, inject } from '@angular/core/testing';

import { CasService } from './cas.service';

describe('CasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CasService]
    });
  });

  it('should be created', inject([CasService], (service: CasService) => {
    expect(service).toBeTruthy();
  }));
});
