import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../user/user.service';

import { StaticLoginService } from './static-login.service';

describe('StaticLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      providers: [StaticLoginService, UserService],
    });
  });

  it('should be created', inject([StaticLoginService], (service: StaticLoginService) => {
    expect(service).toBeTruthy();
  }));
});
