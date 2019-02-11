import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { QuizEntity } from '../../../../lib/entities/QuizEntity';
import { MessageProtocol, StatusProtocol } from '../../../../lib/enums/Message';

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
      status: StatusProtocol.Failed,
      step: MessageProtocol.Unavailable,
      payload: {
        authorizeViaCas: true,
        provideNickSelection: false,
      },
    };

    service.getQuizStatus(quizName).subscribe();
    backend.expectOne(`${service.getQuizStatusUrl}/${quizName}`).flush(quizStatusData);

    expect(service).toBeTruthy();
  }));

  it('should return a free member group', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizStatusData = {
      status: StatusProtocol.Success,
      step: MessageProtocol.Updated,
      payload: {
        groupName: 'testGroup',
      },
    };

    service.getFreeMemberGroup().subscribe();
    backend.expectOne(service.getFreeMemberGroupUrl).flush(quizStatusData);

    expect(service).toBeTruthy();
  }));

  it('should delete a quiz', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';
    const quizDeleteData = {
      quizName,
      privateKey: '123456789',
    };

    service.deleteQuiz(new QuizEntity(quizDeleteData)).subscribe();
    backend.expectOne(`${service.deleteQuizUrl}/${quizName}`).flush({});

    expect(service).toBeTruthy();
  }));

  it('should generate a Demo Quiz', inject([QuizApiService], (service: QuizApiService) => {

    const langKey = 'en';

    service.generateDemoQuiz(langKey).subscribe();
    backend.expectOne(`${service.getDemoQuizUrl}/${langKey}`).flush({});

    expect(service).toBeTruthy();
  }));

  it('should generate an ABCD Quiz', inject([QuizApiService], (service: QuizApiService) => {

    const langKey = 'en';
    const length = 4;

    service.generateABCDQuiz(langKey, length).subscribe();
    backend.expectOne(`${service.getAbcdQuizUrl}/${langKey}/${length}`).flush({});

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
    backend.expectOne(service.postQuizSettingsUpdateUrl).flush({});

    expect(service).toBeTruthy();
  }));

  it('should get the quiz settings', inject([QuizApiService], (service: QuizApiService) => {

    const quizName = 'test';

    service.getQuizStatus(quizName).subscribe();
    backend.expectOne(`${service.getQuizStatusUrl}/${quizName}`).flush({});

    expect(service).toBeTruthy();
  }));

  it('should post a quiz upload', inject([QuizApiService], (service: QuizApiService) => {

    const formData = new FormData();
    formData.append('privateKey', '123456789');

    service.postQuizUpload(formData).subscribe();
    backend.expectOne(service.postQuizUploadUrl).flush({});

    expect(service).toBeTruthy();
  }));
});