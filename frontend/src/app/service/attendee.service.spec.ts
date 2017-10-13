import { TestBed, inject } from '@angular/core/testing';

import { AttendeeService } from './attendee.service';

describe('AttendeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendeeService]
    });
  });

  it('should be created', inject([AttendeeService], (service: AttendeeService) => {
    expect(service).toBeTruthy();
  }));
});
