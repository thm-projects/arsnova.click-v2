import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';

import { CasLoginService } from './cas-login.service';

describe('CasLoginService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule,
      ],
      providers: [
        UserService, CasLoginService,
      ],
    });
  }));

  it('should be created', async(inject([CasLoginService], (service: CasLoginService) => {
    expect(service).toBeTruthy();
  })));
});
