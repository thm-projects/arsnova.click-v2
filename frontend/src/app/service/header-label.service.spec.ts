import {inject, TestBed} from '@angular/core/testing';

import {HeaderLabelService} from './header-label.service';

describe('HeaderLabelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderLabelService]
    });
  });

  it('should be created', inject([HeaderLabelService], (service: HeaderLabelService) => {
    expect(service).toBeTruthy();
  }));
});
