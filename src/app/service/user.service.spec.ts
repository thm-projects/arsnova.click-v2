import {async, inject, TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('UserService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        UserService
      ]
    });
  }));

  it('should be created', async(inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  })));
});
