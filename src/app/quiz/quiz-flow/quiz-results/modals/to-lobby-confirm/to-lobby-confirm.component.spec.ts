import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { ThemesMockService } from '../../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../../service/themes/themes.service';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';

import { ToLobbyConfirmComponent } from './to-lobby-confirm.component';

describe('ToLobbyConfirmComponent', () => {
  let component: ToLobbyConfirmComponent;
  let fixture: ComponentFixture<ToLobbyConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, NgbActiveModal,
      ],
      declarations: [ToLobbyConfirmComponent],
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
