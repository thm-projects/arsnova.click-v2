import {Component, Input, OnInit} from '@angular/core';
import {HeaderLabelService} from 'app/service/header-label.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConnectionService} from '../../service/connection.service';

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

  private _finishedWithErrors: Boolean = false;
  private _finishedWithWarnings: Boolean = false;
  private _origin: string = location.hostname;
  private _inHomeRoute: Boolean = location.pathname === '/';
  private _localStorageAvailable: boolean = isLocalStorageSupported();
  private _sessionStorageAvailable: boolean = isSessionStorageSupported();

  @Input() headerLabel: string;

  get finishedWithErrors(): Boolean {
    return this._finishedWithErrors;
  }

  set finishedWithErrors(state: Boolean) {
    this._finishedWithErrors = state;
  }

  get finishedWithWarnings(): Boolean {
    return this._finishedWithWarnings;
  }

  set finishedWithWarnings(state: Boolean) {
    this._finishedWithWarnings = state;
  }

  get origin(): string {
    return this._origin;
  }

  constructor(
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private modalService: NgbModal,
    private connectionService: ConnectionService) {
    const self = this;
    router.events.subscribe((url: any) => {
      self.inHomeRoute = (url.url === '/home' || url.url === '/');
    });
  }

  ngOnInit() {
  }

  openConnectionQualityModal(content: string): void {
    this.modalService.open(content);
    this.connectionService.calculateRTT();
  }
}
