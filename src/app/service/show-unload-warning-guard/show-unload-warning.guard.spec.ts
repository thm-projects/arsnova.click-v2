import { inject, TestBed } from '@angular/core/testing';

import { ShowUnloadWarningGuard } from './show-unload-warning.guard';

describe('ShowUnloadWarningGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowUnloadWarningGuard],
    });
  });

  it('should ...', inject([ShowUnloadWarningGuard], (guard: ShowUnloadWarningGuard) => {
    expect(guard).toBeTruthy();
  }));
});
