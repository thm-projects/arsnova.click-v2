import { async, inject, TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedService,
      ],
    });
  }));

  it('should be created', async(inject([SharedService], (service: SharedService) => {
    expect(service).toBeTruthy();
  })));
});
