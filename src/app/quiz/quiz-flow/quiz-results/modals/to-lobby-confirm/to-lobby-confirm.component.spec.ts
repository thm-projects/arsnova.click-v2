import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/_services/TranslateServiceMock';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { ThemesMockService } from '../../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../../service/themes/themes.service';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';

import { ToLobbyConfirmComponent } from './to-lobby-confirm.component';

describe('ToLobbyConfirmComponent', () => {
  let component: ToLobbyConfirmComponent;
  let fixture: ComponentFixture<ToLobbyConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, NgbActiveModal,
      ],
      declarations: [ToLobbyConfirmComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faDownload);
    fixture = TestBed.createComponent(ToLobbyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
