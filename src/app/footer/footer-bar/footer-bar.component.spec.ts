import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { SharedModule } from '../../shared/shared.module';

import { FooterBarComponent } from './footer-bar.component';

describe('FooterBarComponent', () => {
  let component: FooterBarComponent;
  let fixture: ComponentFixture<FooterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, NgbModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, SharedService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FileUploadService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
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
    expect(component.getLinkTarget(footerBarService.footerElemAbout)).toEqual(jasmine.arrayContaining(['info', 'tos']));
  })));

  it('#toggleSetting', (inject([FooterBarService, TrackingService], (footerBarService: FooterBarService, trackingService: TrackingService) => {
    const elem = footerBarService.footerElemAbout;
    spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
    component.toggleSetting(elem);
    expect(trackingService.trackClickEvent).toHaveBeenCalled();
  })));

  it('#fileChange', (inject([FileUploadService], (fileUploadService: FileUploadService) => {
    spyOn(fileUploadService, 'uploadFile').and.callFake(() => {});
    component.fileChange({ target: { files: [new File([], 'testFile')] } });
    expect(fileUploadService.uploadFile).toHaveBeenCalled();
  })));
});
