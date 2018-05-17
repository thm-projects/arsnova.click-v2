import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConnectionService} from '../../service/connection.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {TrackingService} from '../../service/tracking.service';

function isLocalStorageSupported(): boolean {
  try {
    const itemBackup = localStorage.getItem('');
    localStorage.removeItem('');
    localStorage.setItem('', itemBackup);
    if (itemBackup === null) {
      localStorage.removeItem('');
    } else {
      localStorage.setItem('', itemBackup);
    }
    return true;
  } catch (e) {
    return false;
  }
}

function isSessionStorageSupported(): boolean {
  try {
    const itemBackup = sessionStorage.getItem('');
    sessionStorage.removeItem('');
    sessionStorage.setItem('', itemBackup);
    if (itemBackup === null) {
      sessionStorage.removeItem('');
    } else {
      sessionStorage.setItem('', itemBackup);
    }
    return true;
  } catch (e) {
    return false;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public static TYPE = 'HeaderComponent';

  get localStorageAvailable(): boolean {
    return this._localStorageAvailable;
  }

  get sessionStorageAvailable(): boolean {
    return this._sessionStorageAvailable;
  }

  set inHomeRoute(value: boolean) {
    this._inHomeRoute = value;
  }

  get inHomeRoute(): boolean {
    return this._inHomeRoute;
  }

  private _origin: string = location.hostname;
  private _inHomeRoute: boolean;
  private _localStorageAvailable: boolean = isLocalStorageSupported();
  private _sessionStorageAvailable: boolean = isSessionStorageSupported();

  get origin(): string {
    switch (this._origin) {
      case 'beta.arsnova.click':
        return 'Beta';
      case 'staging.arsnova.click':
        return 'Staging';
      case 'localhost':
        return 'DEV';
      default:
        return '';
    }
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public headerLabelService: HeaderLabelService,
    public connectionService: ConnectionService,
    private trackingService: TrackingService
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((url: any) => {
      this.inHomeRoute = (location.pathname === '/home' || location.pathname === '/');
    });
  }

  openConnectionQualityModal(content: string): void {
    this.trackingService.trackClickEvent({
      action: 'ConnectionQualityModal',
      label: 'open-dialog',
      customDimensions: {
        dimension1: this.connectionService.lowSpeed,
        dimension2: this.connectionService.mediumSpeed,
        dimension3: this.connectionService.rtt,
        dimension4: this.connectionService.serverAvailable,
        dimension5: this.connectionService.websocketAvailable,
        dimension6: this.localStorageAvailable,
        dimension7: this.sessionStorageAvailable
      }
    });

    this.modalService.open(content);
    this.connectionService.calculateRTT();
  }
}