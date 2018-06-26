import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../lib/translation.factory';
import { HeaderComponent } from '../../../../header/header/header.component';
import { LivePreviewComponent } from '../../../../live-preview/live-preview/live-preview.component';
import { MarkdownBarComponent } from '../../../../markdown/markdown-bar/markdown-bar.component';
import { ActiveQuestionGroupMockService } from '../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';
import { SharedModule } from '../../../../shared/shared.module';

import { QuestiontextComponent } from './questiontext.component';

class MockRouter {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0,
      });
    },
  };
}

describe('QuestiontextComponent', () => {
  let component: QuestiontextComponent;
  let fixture: ComponentFixture<QuestiontextComponent>;

  beforeEach((
    () => {
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
          }), NgbModalModule.forRoot(),
        ],
        providers: [
          {
            provide: ActiveQuestionGroupService,
            useClass: ActiveQuestionGroupMockService,
          }, HeaderLabelService, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: WebsocketService,
            useClass: WebsocketMockService,
          }, {
            provide: ActivatedRoute,
            useClass: MockRouter,
          }, SharedService, QuestionTextService, {
            provide: TrackingService,
            useClass: TrackingMockService,
          },
        ],
        declarations: [
          HeaderComponent, LivePreviewComponent, MarkdownBarComponent, QuestiontextComponent,
        ],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(QuestiontextComponent);
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
      expect(QuestiontextComponent.TYPE).toEqual('QuestiontextComponent');
    }
  ));

  describe('#connector', () => {
    it('should call the markdown interpreter if a markdown button is pressed', () => {
      expect(() => component.connector('boldMarkdownButton')).not.toThrowError();
    });
  });

  describe('#fireEvent', () => {
    it('should update the height of the textarea and parse the input on keypress', () => {
      const event = <any>{ target: { value: 'testValue' } };
      expect(() => component.fireEvent(event)).not.toThrowError();
    });
  });
});
