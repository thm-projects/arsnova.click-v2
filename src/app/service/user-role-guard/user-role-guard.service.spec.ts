import { TestBed } from '@angular/core/testing';

import { UserRoleGuardService } from './user-role-guard.service';

describe('UserRoleGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRoleGuardService = TestBed.get(UserRoleGuardService);
    expect(service).toBeTruthy();
  });
});
