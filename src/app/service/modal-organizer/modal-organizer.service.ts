import { EventEmitter, Injectable, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddModeComponent } from '../../modals/add-mode/add-mode.component';

@Injectable()
export class ModalOrganizerService {

  @Output() public emitChanges = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  public addKey(dataMap: Array<any>): void {

    const modal: NgbModalRef = this.modalService.open(AddModeComponent);
    (
      <AddModeComponent>modal.componentInstance
    ).dataMap = dataMap;

    modal.result.then((result) => {
      this.emitChanges.next(result);
    }, (reason) => reason ? console.log(reason) : null);
  }

}
