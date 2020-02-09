import { TestBed } from '@angular/core/testing';
import { MarkdownService } from 'ngx-markdown';

import { CustomMarkdownService } from './custom-markdown.service';

describe('CustomMarkdownService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: MarkdownService,
        useValue: {},
      },
    ],
  }));

  it('should be created', () => {
    const service: CustomMarkdownService = TestBed.inject(CustomMarkdownService);
    expect(service).toBeTruthy();
  });
});
