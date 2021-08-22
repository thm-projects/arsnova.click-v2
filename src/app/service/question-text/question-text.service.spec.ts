import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../custom-markdown/CustomMarkdownServiceMock';
import { QuestionTextService } from './question-text.service';

describe('QuestionTextService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, QuestionTextService,
      ],
    });
  }));

  it('should be created', waitForAsync(inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  })));
});
