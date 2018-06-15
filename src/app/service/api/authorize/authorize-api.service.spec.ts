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

  it('should authorize a given cas token', inject([AuthorizeApiService], (service: AuthorizeApiService) => {

    const token = 'testToken';

    service.getAuthorizationForToken(token).subscribe();
    backend.expectOne(service.AUTHORIZE_TOKEN_GET_URL(token)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should authorize by given login credentials', inject([AuthorizeApiService], (service: AuthorizeApiService) => {

    const username = 'testuser';
    const passwordHash = '4a355cdf5c35cc0fc71dfc703d25160d17ff478a';

    service.postAuthorizationForStaticLogin({
      username,
      passwordHash,
    }).subscribe();

    backend.expectOne(service.AUTHORIZE_STATIC_POST_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should validate a given login token', inject([AuthorizeApiService], (service: AuthorizeApiService) => {

    const username = 'testuser';
    const token = 'testtoken';

    service.getValidateStaticLoginToken(username, token).subscribe();

    backend.expectOne(service.AUTHORIZE_VALIDATE_TOKEN_GET_URL(username, token)).flush({});

    expect(service).toBeTruthy();
  }));
});
