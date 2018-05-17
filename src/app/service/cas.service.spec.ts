import {async, inject, TestBed} from '@angular/core/testing';

import {CasService} from './cas.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from './user.service';

describe('CasService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        UserService,
        CasService
      ]
    });
  }));

  it('should be created', async(inject([CasService], (service: CasService) => {
    expect(service).toBeTruthy();
  })));
});
