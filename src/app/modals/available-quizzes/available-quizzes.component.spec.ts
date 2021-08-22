import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

  beforeEach(waitForAsync(() => {
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
        },
      ],
      declarations: [AvailableQuizzesComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AvailableQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', waitForAsync(() => {
    expect(AvailableQuizzesComponent.TYPE).toEqual('AvailableQuizzesComponent');
  }));

  it('#dismiss', waitForAsync(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
    spyOn(component, 'dismiss').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();

    component.dismiss();

    expect(component.dismiss).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalled();
  })));

  it('#abort', waitForAsync(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
    spyOn(component, 'abort').and.callThrough();
    spyOn(activeModal, 'close').and.callThrough();

    component.abort();

    expect(component.abort).toHaveBeenCalled();
    expect(activeModal.close).toHaveBeenCalled();
  })));

  it('#next', waitForAsync(inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
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
