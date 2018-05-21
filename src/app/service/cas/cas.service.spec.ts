import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';

import { CasService } from './cas.service';

describe('CasService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        UserService,
        CasService,
      ],
    });
  }));

  it('should be created', async(inject([CasService], (service: CasService) => {
    expect(service).toBeTruthy();
  })));
});
