import {inject, TestBed} from '@angular/core/testing';

import {QuestionTextService} from './question-text.service';

describe('QuestionTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
                                     providers: [QuestionTextService]
                                   });
  });

  it('should be created', inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  }));
});
