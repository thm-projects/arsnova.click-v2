import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';
import { UserRoleGuardService } from './user-role-guard.service';

describe('UserRoleGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
      {
        provide: UserService,
        useValue: {},
      },
    ],
  }));

  it('should be created', () => {
    const service: UserRoleGuardService = TestBed.get(UserRoleGuardService);
    expect(service).toBeTruthy();
  });
});
