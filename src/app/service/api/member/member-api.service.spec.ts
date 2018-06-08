import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

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

  it('should put a confidence value for a member', inject(
    [MemberApiService], (service: MemberApiService) => {

      const quizName = 'test';
      const nickName = 'testNick';
      const memberConfidenceData = {
        quizName,
        nickname: nickName,
        confidenceValue: 42,
      };

      service.putConfidenceValue(memberConfidenceData).subscribe();
      backend.expectOne(service.MEMBER_CONFIDENCE_VALUE_PUT_URL()).flush({});

      expect(service).toBeTruthy();
    }),
  );

  it('should delete a member', inject(
    [MemberApiService], (service: MemberApiService) => {

      const quizName = 'test';
      const nickName = 'testNick';

      service.deleteMember(quizName, nickName).subscribe();
      backend.expectOne(service.MEMBER_DELETE_URL(quizName, nickName)).flush({});

      expect(service).toBeTruthy();
    }),
  );

  it('should put a reading confirmation value for a member', inject(
    [MemberApiService], (service: MemberApiService) => {

      const quizName = 'test';
      const nickName = 'testNick';
      const memberReadingConfirmationData = {
        quizName: quizName,
        nickname: nickName,
        questionIndex: 0,
      };

      service.putReadingConfirmationValue(memberReadingConfirmationData).subscribe();
      backend.expectOne(service.MEMBER_READING_CONFIRMATION_PUT_URL()).flush({});

      expect(service).toBeTruthy();
    }),
  );

  it('should put a response value for a member', inject(
    [MemberApiService], (service: MemberApiService) => {

      const quizName = 'test';
      const nickName = 'testNick';
      const memberResponseData = {
        quizName,
        nickname: nickName,
        value: [0],
      };

      service.putResponse(memberResponseData).subscribe();
      backend.expectOne(service.MEMBER_RESPONSE_PUT_URL()).flush({});

      expect(service).toBeTruthy();
    }),
  );

  it('should add a member', inject(
    [MemberApiService], (service: MemberApiService) => {

      const quizName = 'test';
      const nickName = 'testNick';
      const memberContentData = {
        quizName: quizName,
        nickname: nickName,
        groupName: 'Default',
        ticket: '',
      };

      service.putMember(memberContentData).subscribe();
      backend.expectOne(service.MEMBER_PUT_MEMBER_URL()).flush({});

      expect(service).toBeTruthy();
    }),
  );

  it('should get a list of available nicknames', inject(
    [MemberApiService], (service: MemberApiService) => {
      const quizName = 'test';

      service.getAvailableMemberNames(quizName).subscribe();
      backend.expectOne(service.MEMBER_GET_AVAILABLE_NAMES_URL(quizName)).flush({});
      expect(service).toBeTruthy();
    }),
  );
});
