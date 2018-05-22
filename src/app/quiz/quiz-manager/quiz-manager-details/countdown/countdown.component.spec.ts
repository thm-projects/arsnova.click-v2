import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';

import { CountdownComponent } from './countdown.component';

class MockRouter {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0,
      });
    },
  };
}

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
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
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        HeaderLabelService,
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        { provide: ActivatedRoute, useClass: MockRouter },
        SharedService,
      ],
      declarations: [CountdownComponent],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', (() => {
    expect(CountdownComponent.TYPE).toEqual('CountdownComponent');
  }));

  describe('#updateCountdown', () => {
    it('should update the countdown',
      inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const initValue = activeQuestionGroupService.activeQuestionGroup.questionList[0].timer;
        const newValue = initValue + 10;

        component.updateCountdown(newValue);

        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0].timer).toEqual(newValue);
        expect(component.countdown).toEqual(newValue);
      }));
  });
});
