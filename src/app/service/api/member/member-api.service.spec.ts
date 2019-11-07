import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MemberEntity } from '../../../lib/entities/member/MemberEntity';

import { MemberApiService } from './member-api.service';

describe('MemberApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [MemberApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([MemberApiService], (service: MemberApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should put a confidence value for a member', inject([MemberApiService], (service: MemberApiService) => {

    const quizName = 'test';
    const nickName = 'testNick';
    const memberConfidenceData = {
      quizName,
      nickname: nickName,
      confidenceValue: 42,
    };

    service.putConfidenceValue(42).subscribe();
    backend.expectOne(service.putConfidenceValueUrl).flush({});

    expect(service).toBeTruthy();
  }));

  it('should put a reading confirmation value for a member', inject([MemberApiService], (service: MemberApiService) => {

    const quizName = 'test';
    const nickName = 'testNick';
    const memberReadingConfirmationData = {
      quizName: quizName,
      nickname: nickName,
      questionIndex: 0,
    };

    service.putReadingConfirmationValue().subscribe();
    backend.expectOne(service.putReadingConfirmationValueUrl).flush({});

    expect(service).toBeTruthy();
  }));

  it('should put a response value for a member', inject([MemberApiService], (service: MemberApiService) => {

    const quizName = 'test';
    const nickName = 'testNick';
    const memberResponseData = {
      quizName,
      nickname: nickName,
      value: [0],
    };

    service.putResponse(memberResponseData).subscribe();
    backend.expectOne(service.putResponseUrl).flush({});

    expect(service).toBeTruthy();
  }));

  it('should add a member', inject([MemberApiService], (service: MemberApiService) => {

    const quizName = 'test';
    const nickName = 'testNick';
    const memberContentData = new MemberEntity({
      quizName: quizName,
      nickname: nickName,
      groupName: 'Default',
      ticket: '',
    });

    service.putMember(memberContentData).subscribe();
    backend.expectOne(service.putMemberUrl).flush({});

    expect(service).toBeTruthy();
  }));

});
