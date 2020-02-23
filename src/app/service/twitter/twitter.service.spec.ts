import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { ThemesMockService } from '../themes/themes.mock.service';
import { ThemesService } from '../themes/themes.service';
import { TwitterService } from './twitter.service';

describe('TwitterService', () => {
  let service: TwitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, I18nTestingModule],
      providers: [
        {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, {
          provide: CustomMarkdownService,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(TwitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
