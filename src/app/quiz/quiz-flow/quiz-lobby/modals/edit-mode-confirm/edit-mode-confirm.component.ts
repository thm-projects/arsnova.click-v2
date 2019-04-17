import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-mode-confirm',
  templateUrl: './edit-mode-confirm.component.html',
  styleUrls: ['./edit-mode-confirm.component.scss'],
})
export class EditModeConfirmComponent {

  constructor(private activeModal: NgbActiveModal) { }

  public confirm(): void {
    this.activeModal.close();
  }

  public abort(): void {
    this.activeModal.dismiss();
  }
}
