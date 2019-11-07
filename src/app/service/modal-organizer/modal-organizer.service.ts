import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModeComponent } from '../../modals/add-mode/add-mode.component';

@Injectable({
  providedIn: 'root',
})
export class ModalOrganizerService {

  constructor(private modalService: NgbModal) { }

  public addKey(): void {
    this.modalService.open(AddModeComponent).result.then(() => {}, (reason) => reason ? console.error(reason) : null);
  }
}
