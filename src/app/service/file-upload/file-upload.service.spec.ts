import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, FooterBarService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FileUploadService,
      ],
    });
  }));

  it('should be created', waitForAsync(inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  })));
});
