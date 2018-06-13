import { TestBed, inject } from '@angular/core/testing';

import { ProjectLoaderService } from './project-loader.service';

describe('ProjectLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectLoaderService]
    });
  });

  it('should be created', inject([ProjectLoaderService], (service: ProjectLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
