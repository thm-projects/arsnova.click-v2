import { inject, TestBed } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalOrganizerService } from './modal-organizer.service';

describe('ModalOrganizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule.forRoot(),
      ],
      providers: [ModalOrganizerService],
    });
  });

  it('should be created', inject([ModalOrganizerService], (service: ModalOrganizerService) => {
    expect(service).toBeTruthy();
  }));
});
