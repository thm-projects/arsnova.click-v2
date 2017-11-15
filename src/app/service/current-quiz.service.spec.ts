import {inject, TestBed} from '@angular/core/testing';

import {CurrentQuizService} from './current-quiz.service';

describe('CurrentQuizService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentQuizService]
    });
  });

  it('should be created', inject([CurrentQuizService], (service: CurrentQuizService) => {
    expect(service).toBeTruthy();
  }));
});
