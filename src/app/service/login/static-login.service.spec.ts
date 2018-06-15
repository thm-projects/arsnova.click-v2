import { TestBed, inject } from '@angular/core/testing';

import { StaticLoginService } from './static-login.service';

describe('StaticLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticLoginService]
    });
  });

  it('should be created', inject([StaticLoginService], (service: StaticLoginService) => {
    expect(service).toBeTruthy();
  }));
});
