import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { availableQuestionTypes } from '../../../../lib/available-question-types';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { FooterModule } from '../../../footer/footer.module';
import { ActiveQuestionGroupMockService } from '../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { UserService } from '../../../service/user/user.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';

import { QuizManagerComponent } from './quiz-manager.component';

describe('QuizManagerComponent', () => {
  let component: QuizManagerComponent;
  let fixture: ComponentFixture<QuizManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, FooterModule, TranslateModule.forRoot({
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
        UserService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: ActiveQuestionGroupService,
          useClass: ActiveQuestionGroupMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService,
      ],
      declarations: [QuizManagerComponent],
    }).compileComponents();
  }));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(QuizManagerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(QuizManagerComponent.TYPE).toEqual('QuizManagerComponent');
  }));

  describe('#addQuestion', () => {
    it('should add a question', inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
      const id = availableQuestionTypes[0].id;

      activeQuestionGroupService.activeQuestionGroup.questionList.splice(0, activeQuestionGroupService.activeQuestionGroup.questionList.length);

      component.addQuestion(id);

      expect(activeQuestionGroupService.activeQuestionGroup.questionList.length).toEqual(1);
      expect(activeQuestionGroupService.activeQuestionGroup.questionList[0].TYPE).toEqual(id);
    }));

    it('should not add an invalid question', inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
      const id = 'NotExisting';

      activeQuestionGroupService.activeQuestionGroup.questionList.splice(0, activeQuestionGroupService.activeQuestionGroup.questionList.length);

      component.addQuestion(id);

      expect(activeQuestionGroupService.activeQuestionGroup.questionList.length).toEqual(0);
    }));
  });

  describe('#moveQuestionUp', () => {
    it('should decrement the index of a question in the questionlist by 1',
      inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const question = activeQuestionGroupService.activeQuestionGroup.questionList[1];
        component.moveQuestionUp(1);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0]).toEqual(question);
      }));

    it('should not decrement the index of a question in the questionlist if it is at first position',
      inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const question = activeQuestionGroupService.activeQuestionGroup.questionList[0];
        component.moveQuestionUp(0);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0]).toEqual(question);
      }));
  });

  describe('#moveQuestionDown', () => {
    it('should increment the index of a question in the questionlist by 1',
      inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const question = activeQuestionGroupService.activeQuestionGroup.questionList[1];
        component.moveQuestionDown(1);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[2]).toEqual(question);
      }));

    it('should not increment the index of a question in the questionlist if it is at the last position',
      inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const lastIndex = activeQuestionGroupService.activeQuestionGroup.questionList.length - 1;
        const question = activeQuestionGroupService.activeQuestionGroup.questionList[lastIndex];
        component.moveQuestionDown(lastIndex);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[lastIndex]).toEqual(question);
      }));
  });
});
