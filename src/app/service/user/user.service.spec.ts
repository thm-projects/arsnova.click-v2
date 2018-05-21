import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        UserService,
      ],
    });
  }));

  it('should be created', async(inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  })));
});
