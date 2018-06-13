import { TestBed, inject } from '@angular/core/testing';

import { LanguageLoaderService } from './language-loader.service';

describe('LanguageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageLoaderService]
    });
  });

  it('should be created', inject([LanguageLoaderService], (service: LanguageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
