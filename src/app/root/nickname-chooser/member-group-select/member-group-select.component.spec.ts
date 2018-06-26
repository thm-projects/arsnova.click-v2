import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { UserService } from '../../../service/user/user.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { DB_TABLE, STORAGE_KEY } from '../../../shared/enums';
import { SharedModule } from '../../../shared/shared.module';

import { MemberGroupSelectComponent } from './member-group-select.component';

describe('MemberGroupSelectComponent', () => {
  let component: MemberGroupSelectComponent;
  let fixture: ComponentFixture<MemberGroupSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, UserService,
      ],
      declarations: [MemberGroupSelectComponent],
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

  describe('#addToGroup', () => {

    it('should add an attendee to a free member group', async(inject([Router, StorageService], (router: Router, storageService: StorageService) => {
      spyOn(component, 'addToGroup').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => {});

      component.addToGroup('testGroup').then(() => {
        expect(component.addToGroup).not.toThrowError();
        storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.MEMBER_GROUP).subscribe(val => {
          expect(val).toEqual('testGroup');
          expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'input']);
        });
      });
    })));
  });
});
