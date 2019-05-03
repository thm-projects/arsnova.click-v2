import { Component, OnDestroy } from '@angular/core';
import { HeaderLabelService } from '../../service/header-label/header-label.service';

@Component({
  selector: 'app-server-unavailable-modal',
  templateUrl: './server-unavailable-modal.component.html',
  styleUrls: ['./server-unavailable-modal.component.scss'],
})
export class ServerUnavailableModalComponent implements OnDestroy {

  constructor(private headerLabelService: HeaderLabelService) {
    this.headerLabelService.isUnavailableModalOpen = true;
  }

  public reloadPage(): void {
    location.reload(true);
  }

  public ngOnDestroy(): void {
    this.headerLabelService.isUnavailableModalOpen = false;
  }
}
