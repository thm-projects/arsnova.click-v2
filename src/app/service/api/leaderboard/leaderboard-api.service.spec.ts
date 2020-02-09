import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { LeaderboardApiService } from './leaderboard-api.service';

describe('LeaderboardApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [LeaderboardApiService],
    });
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([LeaderboardApiService], (service: LeaderboardApiService) => {
    expect(service).toBeTruthy();
  }));

});
