import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { TranslatePipeMock } from '../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../_mocks/TranslateServiceMock';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { UserService } from '../../../service/user/user.service';

import { MemberGroupSelectComponent } from './member-group-select.component';

describe('MemberGroupSelectComponent', () => {
  let component: MemberGroupSelectComponent;
  let fixture: ComponentFixture<MemberGroupSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        RxStompService,
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: UserService,
          useValue: {},
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [MemberGroupSelectComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MemberGroupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(MemberGroupSelectComponent.TYPE).toEqual('MemberGroupSelectComponent');
  }));

  xdescribe('#addToGroup', () => {

    it('should add an attendee to a free member group', async(inject([Router, StorageService], (router: Router, storageService: StorageService) => {
      spyOn(component, 'addToGroup').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.addToGroup('testGroup');
      expect(component.addToGroup).not.toThrowError();
      expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'input']);
    })));
  });
});
