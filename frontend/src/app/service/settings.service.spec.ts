import {TestBed, inject} from '@angular/core/testing';

import {DefaultSettings} from './settings.service';

describe('DefaultSettings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultSettings]
    });
  });

  it('should be created', inject([DefaultSettings], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));
});
