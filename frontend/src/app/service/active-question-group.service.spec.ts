import {TestBed, inject} from '@angular/core/testing';

import {ActiveQuestionGroupService} from './active-question-group.service';

describe('ActiveQuestionGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveQuestionGroupService]
    });
  });

  it('should be created', inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    expect(service).toBeTruthy();
  }));
});
