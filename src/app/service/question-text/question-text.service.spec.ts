import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { QuestionTextService } from './question-text.service';

describe('QuestionTextService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, QuestionTextService,
      ],
    });
  }));

  it('should be created', async(inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  })));
});
