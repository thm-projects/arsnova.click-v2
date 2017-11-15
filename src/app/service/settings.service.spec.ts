import {inject, TestBed} from '@angular/core/testing';

import {DefaultSettings} from '../../lib/default.settings';
import {SettingsService} from './settings.service';

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
