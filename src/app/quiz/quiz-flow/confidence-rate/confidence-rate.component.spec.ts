import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { Subscription } from 'rxjs';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';
import { ConfidenceRateComponent } from './confidence-rate.component';

describe('QuizFlow: ConfidenceRateComponent', () => {
  let component: ConfidenceRateComponent;
  let fixture: ComponentFixture<ConfidenceRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
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
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, HeaderLabelService, FooterBarService, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, SettingsService, MemberApiService,
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
    expect(component.getConfidenceLevelTranslation()).toEqual('component.voting.confidence_level.very_sure');
  }));

  it('#updateConficence', async(() => {
    const event = new Event('testEvent');
    spyOnProperty(event, 'target').and.callFake(() => ({ value: '20' }));

    component.updateConficence(event);

    expect(component.getConfidenceLevelTranslation()).toEqual('component.voting.confidence_level.no_idea');
  }));

  it('#sendConfidence', async(() => {
    spyOn(component, 'sendConfidence').and.callFake(() => new Promise<Subscription>(resolve => resolve()));

    component.sendConfidence();

    expect(component.sendConfidence).not.toThrowError();
  }));

});
