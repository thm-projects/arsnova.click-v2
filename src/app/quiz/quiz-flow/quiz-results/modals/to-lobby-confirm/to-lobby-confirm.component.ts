import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-to-lobby-confirm',
  templateUrl: './to-lobby-confirm.component.html',
  styleUrls: ['./to-lobby-confirm.component.scss'],
})
export class ToLobbyConfirmComponent {

  constructor(private activeModal: NgbActiveModal) { }

  public confirm(): void {
    this.activeModal.close();
  }

  public abort(): void {
    this.activeModal.dismiss();
  }
}
