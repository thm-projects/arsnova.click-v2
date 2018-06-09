import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { QuizApiService } from './quiz-api.service';

describe('QuizApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([QuizApiService], (service: QuizApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should load the quiz status', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizStatusData = {
      status: 'STATUS:FAILED',
      step: 'QUIZ:UNAVAILABLE',
      payload: {
        authorizeViaCas: true,
        provideNickSelection: false,
      },
    };

    service.getQuizStatus(quizName).subscribe();
    backend.expectOne(service.QUIZ_STATUS_URL(quizName)).flush(quizStatusData);

    expect(service).toBeTruthy();
  }));

  it('should return a free member group', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizStatusData = {
      status: 'STATUS:SUCCESSFUL',
      step: 'LOBBY:MEMBER_UPDATED',
      payload: {
        groupName: 'testGroup',
      },
    };

    service.getFreeMemberGroup(quizName).subscribe();
    backend.expectOne(service.QUIZ_MEMBER_GROUP_URL(quizName)).flush(quizStatusData);

    expect(service).toBeTruthy();
  }));

  it('should reserve a quiz name', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizReservationData = {
      quizName: quizName,
      privateKey: '1234567890',
    };

    service.postQuizReservationOverride(quizReservationData).subscribe();
    backend.expectOne(service.QUIZ_RESERVATION_OVERRIDE_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should post some quiz data', inject([QuizApiService], (service: QuizApiService) => {

    const target = 'reading-confirmation';
    const quizName = 'test';
    const quizReservationData = {
      quizName,
    };

    service.postQuizData(target, quizReservationData).subscribe();
    backend.expectOne(service.QUIZ_POST_DATA_URL(target)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should get the current quiz state', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';

    service.getCurrentQuizState(quizName).subscribe();
    backend.expectOne(service.QUIZ_CURRENT_STATE_URL(quizName)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should reset the quiz', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';

    service.patchQuizReset(quizName).subscribe();
    backend.expectOne(service.QUIZ_RESET_URL(quizName)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should stop the quiz', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizStopData = {
      quizName,
    };

    service.postQuizStop(quizStopData).subscribe();
    backend.expectOne(service.QUIZ_STOP_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should get the quiz start time', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';

    service.getQuizStartTime(quizName).subscribe();
    backend.expectOne(service.QUIZ_GET_START_TIME_URL(quizName)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should delete a quiz', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizDeleteData = {
      body: {
        quizName,
        privateKey: '123456789',
      },
    };

    service.deleteQuiz(quizDeleteData).subscribe();
    backend.expectOne(service.QUIZ_DELETE_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should deactivate an active quiz', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizDeactivateData = {
      body: {
        quizName,
        privateKey: '123456789',
      },
    };

    service.deactivateQuizAsOwner(quizDeactivateData).subscribe();
    backend.expectOne(service.QUIZ_DEACTIVATE_DELETE_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should generate a Demo Quiz', inject([QuizApiService], (service: QuizApiService) => {

    const langKey = 'en';

    service.generateDemoQuiz(langKey).subscribe();
    backend.expectOne(service.QUIZ_GENERATE_DEMO_QUIZ_URL(langKey)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should generate an ABCD Quiz', inject([QuizApiService], (service: QuizApiService) => {

    const langKey = 'en';
    const length = 4;

    service.generateABCDQuiz(langKey, length).subscribe();
    backend.expectOne(service.QUIZ_GENERATE_ABCD_QUIZ_URL(langKey, length)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should cache the quiz assets', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizContentData = {
      body: {
        quizName,
        privateKey: '123456789',
      },
    };

    service.postCacheQuizAssets(quizContentData).subscribe();
    backend.expectOne(service.QUIZ_CACHE_QUIZ_ASSETS_POST_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should update the quiz settings', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizSettingsUpdateData = {
      quizName: quizName,
      target: 'showResponseProgress',
      state: true,
    };

    service.postQuizSettingsUpdate(quizSettingsUpdateData).subscribe();
    backend.expectOne(service.QUIZ_SETTINGS_UPDATE_POST_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should get the quiz settings', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';

    service.getQuizSettings(quizName).subscribe();
    backend.expectOne(service.QUIZ_SETTINGS_GET_URL(quizName)).flush({});

    expect(service).toBeTruthy();
  }));

  it('should post a quiz upload', inject([QuizApiService], (service: QuizApiService) => {

    const formData = new FormData();
    formData.append('privateKey', '123456789');

    service.postQuizUpload(formData).subscribe();
    backend.expectOne(service.QUIZ_UPLOAD_POST_URL()).flush({});

    expect(service).toBeTruthy();
  }));
});
