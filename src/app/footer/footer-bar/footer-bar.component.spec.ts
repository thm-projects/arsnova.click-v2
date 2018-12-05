import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { FooterbarElement } from '../../../lib/footerbar-element/footerbar-element';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { SharedModule } from '../../shared/shared.module';

import { FooterBarComponent } from './footer-bar.component';

describe('FooterBarComponent', () => {
  let component: FooterBarComponent;
  let fixture: ComponentFixture<FooterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, NgbModule, TranslateModule.forRoot({
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
        }, FooterBarService, SharedService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FileUploadService, {
          provide: ActiveQuestionGroupService,
          useClass: ActiveQuestionGroupMockService,
        },
      ],
      declarations: [
        FooterBarComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FooterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(FooterBarComponent.TYPE).toEqual('FooterBarComponent');
  }));

  it('#getLinkTarget', (inject([FooterBarService], (footerBarService: FooterBarService) => {
    expect(component.getLinkTarget(footerBarService.footerElemAbout)).toEqual(jasmine.arrayContaining(['info', 'about']));
  })));

  it('#toggleSetting', (inject([FooterBarService, TrackingService], (footerBarService: FooterBarService, trackingService: TrackingService) => {
    const elem = footerBarService.footerElemAbout;
    spyOn(elem, 'onClickCallback').and.callFake(() => {});
    spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
    component.toggleSetting(elem);
    expect(elem.onClickCallback).toHaveBeenCalled();
    expect(trackingService.trackClickEvent).toHaveBeenCalled();
  })));

  it('#fileChange', (inject([FileUploadService], (fileUploadService: FileUploadService) => {
    spyOn(fileUploadService, 'uploadFile').and.callFake(() => {});
    component.fileChange({ target: { files: [{ name: 'testFile' }] } });
    expect(fileUploadService.uploadFile).toHaveBeenCalled();
  })));

  it('#moveLeft', (inject([FooterBarService], (footerBarService: FooterBarService) => {
    component['_footerElements'] = [
      ...Object.keys(footerBarService).map(t => footerBarService[t] instanceof FooterbarElement ? footerBarService[t] : false),
    ];
    component.footerElemIndex = 2;
    component.moveLeft();
    expect(component.footerElemIndex).toEqual(1);
    component.moveLeft();
    expect(component.footerElemIndex).toEqual(1);
  })));

  it('#moveRight', (inject([FooterBarService], (footerBarService: FooterBarService) => {
    component['_footerElements'] = [
      ...Object.keys(footerBarService).map(t => footerBarService[t] instanceof FooterbarElement ? footerBarService[t] : false),
    ];
    component.footerElemIndex = 1;
    component.moveRight();
    expect(component.footerElemIndex).toEqual(2);
    for (let i = 0; i < component.footerElements.length; i++) {
      component.moveRight();
    }
    expect(component.footerElemIndex).toEqual(component.footerElements.length - 1);
  })));
});
