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
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([LeaderboardApiService], (service: LeaderboardApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the leaderboard data', inject([LeaderboardApiService], (service: LeaderboardApiService) => {

    const quizName = 'test';
    const questionIndex = 0;

    service.getLeaderboardData(quizName, questionIndex).subscribe();
    backend.expectOne(service.LEADERBOARD_GET_DATA_URL(quizName, questionIndex));

    expect(service).toBeTruthy();
  }));
});
