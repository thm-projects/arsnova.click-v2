import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { MemberMock } from '../../../_mocks/_fixtures/member.mock';
import { Attendee } from '../../lib/attendee/attendee';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { TrackingMockService } from '../tracking/tracking.mock.service';
import { AttendeeService } from './attendee.service';

describe('AttendeeService', () => {
  let memberMock: Attendee;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, {
          provide: TranslateService,
          useClass: TrackingMockService,
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, AttendeeService,
      ],
    });
  }));

  beforeEach(() => {
    sessionStorage.clear();
    memberMock = new Attendee(JSON.parse(JSON.stringify(MemberMock)));
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    const service = TestBed.inject(AttendeeService);

    expect(service).toBeTruthy();
  });

  it('should get all member groups', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    expect(service.getMemberGroups().length).toEqual(0);
  });

  it('should get all members of a group', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);

    memberMock.groupName = 'Default';

    service.addMember(memberMock);
    expect(service.getMembersOfGroup('Default')).toContain(memberMock);
  });

  it('should clean up all the local data', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);

    service.addMember(memberMock);

    service.cleanUp().subscribe(() => {
      expect(service.attendees.length).toEqual(0);
    });
  });

  it('should add a member', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);

    memberMock.name = 'testname';

    service.addMember(memberMock);
    expect(service.attendees).toContain(memberMock);
  });

  it('should remove a member', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    memberMock.name = 'testname';
    service.addMember(memberMock);
    service.removeMember(memberMock.name);
    expect(service.attendees).not.toContain(memberMock);
  });

  it('should clear all responses', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const response = {
      value: [0, 1, 2],
      responseTime: 47,
      readingConfirmation: true,
      confidence: 50,
    };

    memberMock.name = 'testname';
    memberMock.responses = [JSON.parse(JSON.stringify(response))];
    service.addMember(memberMock);

    service.clearResponses();
    expect(service.attendees[0].responses).not.toContain(response);
  });

  it('should return true if the provided value equals the own nick', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const nick = 'testname';
    service.ownNick = nick;
    expect(service.isOwnNick(nick)).toBe(true);
  });

  it('should update the response', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const response = {
      value: [0, 1, 2],
      responseTime: 47,
      readingConfirmation: true,
      confidence: 50,
    };

    memberMock.name = 'testname';
    service.addMember(memberMock);

    service.modifyResponse({
      nickname: memberMock.name,
      questionIndex: 0,
      update: response,
    });
    expect(service.attendees[0].responses).toContain(response);
  });

  it('should check if a response is set', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const response = {
      value: [0, 1, 2],
      responseTime: 47,
      readingConfirmation: true,
      confidence: 50,
    };

    memberMock.name = 'testname';
    service.addMember(memberMock);
    service.ownNick = memberMock.name;

    expect(service.hasResponse()).toEqual(false);

    service.modifyResponse({
      nickname: memberMock.name,
      questionIndex: 0,
      update: response,
    });
    expect(service.hasResponse()).toEqual(true);
  });

  it('should check if a reading confirmation is set', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const response = {
      value: [0, 1, 2],
      responseTime: 47,
      readingConfirmation: true,
      confidence: 50,
    };

    memberMock.name = 'testname';
    service.addMember(memberMock);
    service.ownNick = memberMock.name;

    expect(service.hasReadingConfirmation()).toEqual(false);

    service.modifyResponse({
      nickname: memberMock.name,
      questionIndex: 0,
      update: response,
    });
    expect(service.hasReadingConfirmation()).toEqual(true);
  });

  it('should check if a confidence value is set', () => {
    const service: AttendeeService = TestBed.inject(AttendeeService);
    const response = {
      value: [0, 1, 2],
      responseTime: 47,
      readingConfirmation: true,
      confidence: 50,
    };

    memberMock.name = 'testname';
    service.addMember(memberMock);
    service.ownNick = memberMock.name;

    expect(service.hasConfidenceValue()).toEqual(false);

    service.modifyResponse({
      nickname: memberMock.name,
      questionIndex: 0,
      update: response,
    });
    expect(service.hasConfidenceValue()).toEqual(true);
  });
});
