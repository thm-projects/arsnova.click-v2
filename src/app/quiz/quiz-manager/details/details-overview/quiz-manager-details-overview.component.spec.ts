import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../_mocks/TranslateServiceMock';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { IndexedDbService } from '../../../../service/storage/indexed.db.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { QuizManagerDetailsOverviewComponent } from './quiz-manager-details-overview.component';

describe('QuizManagerDetailsOverviewComponent', () => {
  let component: QuizManagerDetailsOverviewComponent;
  let fixture: ComponentFixture<QuizManagerDetailsOverviewComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
          },
        }, SharedService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        },
      ],
      declarations: [QuizManagerDetailsOverviewComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(QuizManagerDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', (() => {
    expect(QuizManagerDetailsOverviewComponent.TYPE).toEqual('QuizManagerDetailsOverviewComponent');
  }));

  it('should track the details destination on click', inject([TrackingService], (trackingService: TrackingService) => {
    spyOn(trackingService, 'trackClickEvent').and.callThrough();
    component.trackDetailsTarget('question-text');
    expect(trackingService.trackClickEvent).toHaveBeenCalled();
  }));
});
