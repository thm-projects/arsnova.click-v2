import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { AdditionalDataComponent } from './additional-data.component';

describe('AdditionalDataComponent', () => {
  let component: AdditionalDataComponent;
  let fixture: ComponentFixture<AdditionalDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: FileUploadService,
          useClass: FileUploadMockService
        }
      ],
      declarations: [AdditionalDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE definition', waitForAsync(() => {
    expect(AdditionalDataComponent.TYPE).toEqual('AdditionalDataComponent');
  }));

  it('#switchShowMoreOrLess', () => {
    const baseState = window.innerWidth >= 768;
    expect(component.isShowingMore).toEqual(baseState);
    component.switchShowMoreOrLess();
    expect(component.isShowingMore).toEqual(!baseState);
  });
});
