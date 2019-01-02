import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';
import { ThemesComponent } from '../../../themes/themes.component';

import { QuizThemeComponent } from './quiz-theme.component';

describe('QuizThemeComponent', () => {
  let component: QuizThemeComponent;
  let fixture: ComponentFixture<QuizThemeComponent>;

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
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        },
      ],
      declarations: [ThemesComponent, QuizThemeComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(QuizThemeComponent.TYPE).toEqual('QuizThemeComponent');
  }));

  it('#updateTheme', async(inject([QuizService], (quizService: QuizService) => {
    const theme = 'theme-Material';

    spyOn(quizService, 'toggleSettingByName').and.callThrough();

    component.updateTheme(theme);
    expect(quizService.quiz.sessionConfig.theme).toEqual(theme);
    expect(quizService.toggleSettingByName).toHaveBeenCalled();
  })));

  it('#previewTheme', () => {
    const theme = 'theme-Material';
    component.previewTheme(theme);
    expect(document.getElementsByTagName('html').item(0).dataset['theme']).toEqual(theme);
  });

  it('#restoreTheme', () => {
    const theme = 'theme-Material';
    const previewedTheme = 'theme-arsnova-click';
    component['previewThemeBackup'] = theme;

    component.previewTheme(previewedTheme);
    component.restoreTheme();
    expect(document.getElementsByTagName('html').item(0).dataset['theme']).toEqual(theme);
  });
});
