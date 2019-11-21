import { inject, TestBed } from '@angular/core/testing';

import { InitDbGuard } from './init-db.guard';

describe('InitDbGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitDbGuard],
    });
  });

  it('should ...', inject([InitDbGuard], (guard: InitDbGuard) => {
    expect(guard).toBeTruthy();
  }));
});
