import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedService,
      ],
    });
  }));

  it('should be created', waitForAsync(inject([SharedService], (service: SharedService) => {
    expect(service).toBeTruthy();
  })));
});
