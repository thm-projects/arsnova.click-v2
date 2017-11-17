import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConnectionService} from '../../service/connection.service';
import {HeaderLabelService} from '../../service/header-label.service';

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
  get localStorageAvailable(): Boolean {
    return this._localStorageAvailable;
  }

  get sessionStorageAvailable(): Boolean {
    return this._sessionStorageAvailable;
  }

  set inHomeRoute(value: Boolean) {
    this._inHomeRoute = value;
  }

  get inHomeRoute(): Boolean {
    return this._inHomeRoute;
  }

  private _origin: string = location.hostname;
  private _inHomeRoute: Boolean;
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
    public connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.router.events.subscribe((url: any) => {
      this.inHomeRoute = (location.pathname === '/home' || location.pathname === '/');
    });
  }

  openConnectionQualityModal(content: string): void {
    this.modalService.open(content);
    this.connectionService.calculateRTT();
  }
}
