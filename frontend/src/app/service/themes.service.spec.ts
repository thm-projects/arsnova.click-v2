import {TestBed, inject} from '@angular/core/testing';

import {ThemesService} from './themes.service';

describe('ThemesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemesService]
    });
  });

  it('should be created', inject([ThemesService], (service: ThemesService) => {
    expect(service).toBeTruthy();
  }));
});
