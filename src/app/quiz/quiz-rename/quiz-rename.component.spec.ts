import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
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

import { QuizRenameComponent } from './quiz-rename.component';

describe('QuizRenameComponent', () => {
  let component: QuizRenameComponent;
  let fixture: ComponentFixture<QuizRenameComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule, FormsModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService,
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: FileUploadService,
          useClass: FileUploadMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [QuizRenameComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(QuizRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', (() => {
    expect(QuizRenameComponent.TYPE).toEqual('QuizRenameComponent');
  }));

  describe('#sendRecommendation', () => {
    it('should parse and send the recommendation for a duplicate quiz', () => {

      spyOn(component, 'sendRecommendation').and.callThrough();

      component.sendRecommendation({
        quizName: 'test',
        fileName: 'test.json',
        renameRecommendation: ['newQuizName'],
      }, 'newQuizName');

      expect(component.sendRecommendation).toHaveBeenCalled();
      expect(() => component.sendRecommendation).not.toThrowError();

    });
  });
});
