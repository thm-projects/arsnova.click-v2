import {Component, Input, OnInit} from '@angular/core';
import {HeaderLabelService} from "app/service/header-label.service";
import {Router} from "@angular/router";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from "@angular/common/http";
import {DefaultSettings} from "../../service/settings.service";

function isLocalStorageSupported():boolean {
  try {
    let itemBackup = localStorage.getItem("");
    localStorage.removeItem("");
    localStorage.setItem("", itemBackup);
    if (itemBackup === null) {
      localStorage.removeItem("");
    }
    else {
      localStorage.setItem("", itemBackup);
    }
    return true;
  } catch (e) {
    return false;
  }
}
function isSessionStorageSupported():boolean {
  try {
    let itemBackup = sessionStorage.getItem("");
    sessionStorage.removeItem("");
    sessionStorage.setItem("", itemBackup);
    if (itemBackup === null) {
      sessionStorage.removeItem("");
    }
    else {
      sessionStorage.setItem("", itemBackup);
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
  set serverAvailable(value: Boolean) {
    this._serverAvailable = value;
  }
  get serverAvailable(): Boolean {
    return this._serverAvailable;
  }
  get websocketAvailable(): Boolean {
    return this._websocketAvailable;
  }
  get localStorageAvailable(): Boolean {
    return this._localStorageAvailable;
  }
  get sessionStorageAvailable(): Boolean {
    return this._sessionStorageAvailable;
  }
  get rtt(): number {
    return this._rtt;
  }
  set inHomeRoute(value: Boolean) {
    this._inHomeRoute = value;
  }
  get inHomeRoute(): Boolean {
    return this._inHomeRoute;
  }
  private _finishedWithErrors : Boolean = false;
  private _finishedWithWarnings : Boolean = false;
  private _offline : Boolean = false;
  private _origin : string = location.hostname;
  private _inHomeRoute : Boolean = location.pathname === "/";
  private _serverAvailable: Boolean = false;
  private _websocketAvailable: Boolean = false;
  private _localStorageAvailable: boolean = isLocalStorageSupported();
  private _sessionStorageAvailable: boolean = isSessionStorageSupported();
  private _rtt: number = 0;

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
  get offline(): Boolean {
    return this._offline;
  }

  private _apiEndpoint = `${DefaultSettings.httpApiEndpoint}/`;

  constructor(private headerLabelService: HeaderLabelService,
              private router: Router,
              private modalService: NgbModal,
              private http:HttpClient) {
    const self = this;
    router.events.subscribe((url:any) => {
      self.inHomeRoute = (url.url === "/home" || url.url === "/");
    });
  }

  ngOnInit() {
  }

  openConnectionQualityModal(content: string): void {
    const self = this;
    this.modalService.open(content);
    const start_time = new Date().getTime();
    self.http.get(`${self._apiEndpoint}`).subscribe(
      () => {
        self.serverAvailable = true;
        self._rtt = new Date().getTime() - start_time;
      },
      () => {self.serverAvailable = false}
    );
  }
}
