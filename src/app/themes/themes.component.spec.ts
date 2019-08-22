import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../lib/translation.factory';
import { ConnectionMockService } from '../service/connection/connection.mock.service';
import { ConnectionService } from '../service/connection/connection.service';
import { FooterBarService } from '../service/footer-bar/footer-bar.service';
import { I18nService } from '../service/i18n/i18n.service';
import { QuizMockService } from '../service/quiz/quiz-mock.service';
import { QuizService } from '../service/quiz/quiz.service';
import { SettingsService } from '../service/settings/settings.service';
import { SharedService } from '../service/shared/shared.service';
import { IndexedDbService } from '../service/storage/indexed.db.service';
import { StorageService } from '../service/storage/storage.service';
import { StorageServiceMock } from '../service/storage/storage.service.mock';
import { ThemesService } from '../service/themes/themes.service';
import { TrackingMockService } from '../service/tracking/tracking.mock.service';
import { TrackingService } from '../service/tracking/tracking.service';
import { SharedModule } from '../shared/shared.module';

import { ThemesComponent } from './themes.component';

describe('ThemesComponent', () => {
  let component: ThemesComponent;
  let fixture: ComponentFixture<ThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        I18nService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, TranslateService, FooterBarService, SettingsService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, ThemesService,
      ],
      declarations: [
        ThemesComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
