import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { ConfidenceRateComponent } from './confidence-rate.component';

describe('QuizFlow: ConfidenceRateComponent', () => {
  let component: ConfidenceRateComponent;
  let fixture: ComponentFixture<ConfidenceRateComponent>;

  beforeEach(async(() => {
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
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: AttendeeService, useClass: AttendeeMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        HeaderLabelService,
        FooterBarService,
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        SettingsService,
      ],
      declarations: [ConfidenceRateComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfidenceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', async(() => {
    expect(ConfidenceRateComponent.TYPE).toEqual('ConfidenceRateComponent');
  }));

  it('#getConfidenceLevel', async(() => {
    expect(component.getConfidenceLevel()).toEqual('very_sure');
  }));

  it('#updateConficence', async(() => {
    const event = new Event('testEvent');
    spyOnProperty(event, 'target').and.callFake(() => ({ value: '20' }));

    component.updateConficence(event);

    expect(component.getConfidenceLevel()).toEqual('no_idea');
  }));

});
