import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { LanguageLoaderService } from './language-loader.service';

describe('LanguageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LanguageLoaderService],
    });
  });

  it('should be created', inject([LanguageLoaderService], (service: LanguageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
