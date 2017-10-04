import { TestBed, inject } from '@angular/core/testing';

import { SoundService } from './sound.service';

describe('SoundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundService]
    });
  });

  it('should be created', inject([SoundService], (service: SoundService) => {
    expect(service).toBeTruthy();
  }));
});
