import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';
import { SharedModule } from '../../../../shared/shared.module';

import { QuizManagerDetailsOverviewComponent } from './quiz-manager-details-overview.component';

class MockRouter {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0,
      });
    },
  };
}

describe('QuizManagerDetailsOverviewComponent', () => {
  let component: QuizManagerDetailsOverviewComponent;
  let fixture: ComponentFixture<QuizManagerDetailsOverviewComponent>;

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
          }),
        ],
        providers: [
          HeaderLabelService, {
            provide: ActiveQuestionGroupService,
            useClass: ActiveQuestionGroupMockService,
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: WebsocketService,
            useClass: WebsocketMockService,
          }, {
            provide: ActivatedRoute,
            useClass: MockRouter,
          }, SharedService, {
            provide: TrackingService,
            useClass: TrackingMockService,
          },
        ],
        declarations: [QuizManagerDetailsOverviewComponent],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(QuizManagerDetailsOverviewComponent);
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
      expect(QuizManagerDetailsOverviewComponent.TYPE).toEqual('QuizManagerDetailsOverviewComponent');
    }
  ));

  describe('#trackDetailsTarget', () => {
    it('should track the details destination on click', inject([TrackingService], (trackingService: TrackingService) => {
      spyOn(trackingService, 'trackClickEvent').and.callThrough();
      component.trackDetailsTarget('question-text');
      expect(trackingService.trackClickEvent).toHaveBeenCalled();
    }));
  });
});
