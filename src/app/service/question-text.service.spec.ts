import {async, inject, TestBed} from '@angular/core/testing';

import {QuestionTextService} from './question-text.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('QuestionTextService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        QuestionTextService
      ]
    });
  }));

  it('should be created', async(inject([QuestionTextService], (service: QuestionTextService) => {
    expect(service).toBeTruthy();
  })));
});
