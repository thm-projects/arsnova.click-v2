import { TestBed, inject } from '@angular/core/testing';

import { ModalOrganizerService } from './modal-organizer.service';

describe('ModalOrganizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalOrganizerService]
    });
  });

  it('should be created', inject([ModalOrganizerService], (service: ModalOrganizerService) => {
    expect(service).toBeTruthy();
  }));
});
