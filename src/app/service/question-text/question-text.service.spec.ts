import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { QuestionTextService } from './question-text.service';

describe('QuestionTextService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        QuestionTextService,
      ],
    });
  }));

  xit('should be created', async(inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  })));
});
