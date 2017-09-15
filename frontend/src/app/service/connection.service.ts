import { Injectable } from '@angular/core';
import {DefaultSettings} from "./settings.service";
import {HttpClient} from "@angular/common/http";
import {WebsocketService} from "./websocket.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ConnectionService {
  get socket(): Subject<any> {
    return this._socket;
  }
  set serverAvailable(value: Boolean) {
    this._serverAvailable = value;
  }
  get serverAvailable(): Boolean {
    return this._serverAvailable;
  }
  get websocketAvailable(): Boolean {
    return this._websocketAvailable;
  }
  get rtt(): number {
    return this._rtt;
  }

  private _socket: Subject<any>;
  private _serverAvailable: Boolean = false;
  private _websocketAvailable: Boolean = false;
  private _rtt: number = 0;
  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}/`;

  constructor(private websocketService: WebsocketService,
              private http:HttpClient) {
    this.initWebsocket();
  }

  private initWebsocket() {
    this._socket = this.websocketService.createWebsocket();
    this._socket.subscribe(
      message => {
        this._websocketAvailable = true;
      },
      message => {
        this._websocketAvailable = false;
      },
      () => {
        this._websocketAvailable = false;
      }
    );
  }

  calculateRTT() {
    const self = this;
    const start_time = new Date().getTime();
    self.http.get(`${self._httpApiEndpoint}`).subscribe(
      () => {
        self.serverAvailable = true;
        self._rtt = new Date().getTime() - start_time;
        if (!this._socket) {
          self.initWebsocket();
        }
      },
      () => {
        self.serverAvailable = false;
        self._websocketAvailable = false;
        this._socket = null;
      }
    );
  }

  sendWebsocketMessage() {
    let done = false;
    let result;
    this._socket.subscribe(
      message => {
        if (!done) {
          this._socket.next({initData: 'local'});
          done = !done;
        }
        result = message;
      },
      message => {
        console.log('error', message);
        result = message;
      },
      () => {
        console.log('completed');
      }
    );
  }
}
