import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { SharedModule } from '../../shared/shared.module';

import { QuizRenameComponent } from './quiz-rename.component';

describe('QuizRenameComponent', () => {
  let component: QuizRenameComponent;
  let fixture: ComponentFixture<QuizRenameComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
            provide: FileUploadService,
            useClass: FileUploadMockService,
          }, {
            provide: ActiveQuestionGroupService,
            useClass: ActiveQuestionGroupMockService,
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: WebsocketService,
            useClass: WebsocketMockService,
          }, SharedService,
        ],
        declarations: [QuizRenameComponent],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(QuizRenameComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));
  it('should contain a TYPE reference', (
    () => {
      expect(QuizRenameComponent.TYPE).toEqual('QuizRenameComponent');
    }
  ));

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
