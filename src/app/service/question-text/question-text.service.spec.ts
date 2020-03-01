import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../custom-markdown/CustomMarkdownServiceMock';
import { QuestionTextService } from './question-text.service';

describe('QuestionTextService', () => {
  beforeEach(async(() => {
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

  it('should be created', async(inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  })));
});
