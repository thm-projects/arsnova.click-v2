import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';

import { AvailableQuizzesComponent } from './available-quizzes.component';

describe('AvailableQuizzesComponent', () => {
  let component: AvailableQuizzesComponent;
  let fixture: ComponentFixture<AvailableQuizzesComponent>;
  let backend: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        NgbActiveModal,
        { provide: TrackingService, useClass: TrackingMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
      ],
      declarations: [AvailableQuizzesComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvailableQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    backend = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    backend.verify();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', async(() => {
    expect(AvailableQuizzesComponent.TYPE).toEqual('AvailableQuizzesComponent');
  }));

  it('#dismiss', async(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
    spyOn(component, 'dismiss').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();

    component.dismiss();

    expect(component.dismiss).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalled();
  })));

  it('#abort', async(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
    spyOn(component, 'abort').and.callThrough();
    spyOn(activeModal, 'close').and.callThrough();

    component.abort();

    expect(component.abort).toHaveBeenCalled();
    expect(activeModal.close).toHaveBeenCalled();
  })));

  it('#next', async(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
    spyOn(component, 'next').and.callThrough();
    spyOn(activeModal, 'close').and.callThrough();

    component.next();

    expect(component.next).toHaveBeenCalled();
    expect(activeModal.close).toHaveBeenCalled();
  })));

  it('#startQuiz', (inject(
    [CurrentQuizService, TrackingService],
    async (currentQuizService: CurrentQuizService, trackingService: TrackingService) => {
      const quiz = currentQuizService.quiz;

      spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});

      component.startQuiz(quiz);
      const req1 = backend.expectOne({
        url: `${DefaultSettings.httpApiEndpoint}/quiz/status/${quiz.hashtag}`,
        method: 'GET',
      });

      req1.flush({
        'status': 'STATUS:SUCCESSFUL',
        'step': 'QUIZ:UNDEFINED',
      });

      expect(trackingService.trackClickEvent).toHaveBeenCalled();
    })));

  it('#editQuiz', (inject(
    [CurrentQuizService, TrackingService, ActiveQuestionGroupService, Router],
    async (
      currentQuizService: CurrentQuizService,
      trackingService: TrackingService,
      activeQuestionGroupService: ActiveQuestionGroupService,
      router: Router,
    ) => {
      const quiz = currentQuizService.quiz;

      spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
      spyOn(component, 'next').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => {});

      component.editQuiz(quiz);

      expect(trackingService.trackClickEvent).toHaveBeenCalled();
      expect(activeQuestionGroupService.activeQuestionGroup).toEqual(quiz);
      expect(router.navigate).toHaveBeenCalled();
      expect(component.next).toHaveBeenCalled();
    })));
});
