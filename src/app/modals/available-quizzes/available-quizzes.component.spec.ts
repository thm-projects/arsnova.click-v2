import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { MemberApiService } from '../../service/api/member/member-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { AvailableQuizzesComponent } from './available-quizzes.component';

describe('AvailableQuizzesComponent', () => {
  let component: AvailableQuizzesComponent;
  let fixture: ComponentFixture<AvailableQuizzesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgbModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbActiveModal, MemberApiService, QuizApiService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: FileUploadService,
          useClass: FileUploadMockService,
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [AvailableQuizzesComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvailableQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

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

  it('#startQuiz', (
    inject([QuizService, TrackingService], (quizService: QuizService, trackingService: TrackingService) => {
      const quiz = quizService.quiz;

      spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});

      component.startQuiz(quiz);

      expect(trackingService.trackClickEvent).toHaveBeenCalled();
    })
  ));

  it('#editQuiz', (
    inject([QuizService, TrackingService, QuizService, Router], (quizService: QuizService, trackingService: TrackingService, router: Router) => {
      const quiz = quizService.quiz;

      spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
      spyOn(component, 'next').and.callThrough();

      component.editQuiz(quiz);

      expect(trackingService.trackClickEvent).toHaveBeenCalled();
      expect(quizService.quiz).toEqual(quiz);
      expect(component.next).toHaveBeenCalled();
    })
  ));
});
