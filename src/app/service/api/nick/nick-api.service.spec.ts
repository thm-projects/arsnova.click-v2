import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { NickApiService } from './nick-api.service';

describe('NickApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NickApiService],
    });

    backend = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([NickApiService], (service: NickApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a list of predefined nicknames', inject([NickApiService], (service: NickApiService) => {

    service.getPredefinedNicks().subscribe();
    backend.expectOne(service.GET_PREDEFINED_NICKS_URL()).flush({});

    expect(service).toBeTruthy();
  }));
});
