import { inject, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TrackingMockService } from '../tracking/tracking.mock.service';

import { ShowUnloadWarningGuard } from './show-unload-warning.guard';

describe('ShowUnloadWarningGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShowUnloadWarningGuard, {
          provide: TranslateService,
          useClass: TrackingMockService,
        },
      ],
    });
  });

  it('should ...', inject([ShowUnloadWarningGuard], (guard: ShowUnloadWarningGuard<any>) => {
    expect(guard).toBeTruthy();
  }));
});
