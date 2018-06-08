import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { AuthorizeApiService } from './authorize-api.service';

describe('AuthorizeApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorizeApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([AuthorizeApiService], (service: AuthorizeApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([AuthorizeApiService], (service: AuthorizeApiService) => {

    const token = 'testToken';

    service.getAuthorizationForToken(token).subscribe();
    backend.expectOne(service.AUTHORIZE_TOKEN_GET_URL(token)).flush({});

    expect(service).toBeTruthy();
  }));
});
