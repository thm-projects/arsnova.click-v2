import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/src/communication_protocol';
import { CurrentQuizMockService } from '../../current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../current-quiz/current-quiz.service';

import { LobbyApiService } from './lobby-api.service';

describe('LobbyApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LobbyApiService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        },
      ],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([LobbyApiService], (service: LobbyApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should load the lobby status',
    inject([LobbyApiService, CurrentQuizService], (service: LobbyApiService, currentQuizService: CurrentQuizService) => {

      const quizName = 'test';
      const customQuiz = currentQuizService.quiz;
      customQuiz.hashtag = quizName;
      const lobbyStatusData = {
        status: COMMUNICATION_PROTOCOL.STATUS.SUCCESSFUL,
        step: COMMUNICATION_PROTOCOL.QUIZ.AVAILABLE,
        payload: {
          quiz: {
            originalObject: customQuiz.serialize(),
          },
        },
      };

      service.getLobbyStatus(quizName).subscribe();
      backend.expectOne(service.LOBBY_STATUS_URL(quizName)).flush(lobbyStatusData);

      expect(service).toBeTruthy();
    }));

  it('should put the quiz content to the lobby',
    inject([LobbyApiService, CurrentQuizService], (service: LobbyApiService, currentQuizService: CurrentQuizService) => {

      const quizName = 'test';
      const customQuiz = currentQuizService.quiz;
      customQuiz.hashtag = quizName;
      const lobbyStatusData = {
        quiz: customQuiz.serialize(),
      };

      service.putLobby(lobbyStatusData).subscribe();
      backend.expectOne(service.LOBBY_PUT_URL()).flush({});

      expect(service).toBeTruthy();
    }));
});
