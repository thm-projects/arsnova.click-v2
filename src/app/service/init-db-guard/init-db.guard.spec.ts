import { TestBed } from '@angular/core/testing';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UserService } from '../user/user.service';

import { InitDbGuard } from './init-db.guard';

describe('InitDbGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {},
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, InitDbGuard,
      ],
    });
  });

  it('should initialize the guard', () => {
    const guard = TestBed.inject(InitDbGuard);
    expect(guard).toBeTruthy();
  });
});
