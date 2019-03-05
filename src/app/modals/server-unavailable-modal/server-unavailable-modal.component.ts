import { Component } from '@angular/core';

@Component({
  selector: 'app-server-unavailable-modal',
  templateUrl: './server-unavailable-modal.component.html',
  styleUrls: ['./server-unavailable-modal.component.scss'],
})
export class ServerUnavailableModalComponent {

  constructor() { }

  public reloadPage(): void {
    location.reload(true);
  }
}
