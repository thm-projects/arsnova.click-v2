import {Injectable} from '@angular/core';
import {DefaultSettings} from '../../lib/default.settings';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from './websocket.service';
import {Subject} from 'rxjs/Subject';
import {IMessage} from 'arsnova-click-v2-types/src/common';

@Injectable()
export class ConnectionService {
  get lowSpeed(): boolean {
    return this._lowSpeed;
  }
  get mediumSpeed(): boolean {
    return this._mediumSpeed;
  }
  set websocketAvailable(value: Boolean) {
    this._websocketAvailable = value;
  }

  get socket(): Subject<IMessage> {
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

  private _socket: Subject<IMessage>;
  private _serverAvailable: Boolean;
  private _websocketAvailable: Boolean = false;
  private _rtt = 0;
  private _isWebSocketAuthorized = false;
  private _lowSpeed = false;
  private _mediumSpeed = false;

  constructor(
    private websocketService: WebsocketService,
    private http: HttpClient) {
    this.initWebsocket();
  }

  private initWebsocket() {
    this._socket = <Subject<IMessage>>this.websocketService.connect()
                                          .map((response: MessageEvent): IMessage => {
                                            this._websocketAvailable = true;
                                            return JSON.parse(response.data);
                                          });
  }

  cleanUp(): void {
    this._isWebSocketAuthorized = false;
  }

  public sendMessage(message: IMessage): void {
    if (!this._websocketAvailable) {
      setTimeout(() => {
        this.sendMessage(message);
      }, 500);
      return;
    }
    this._socket.next(message);
  }

  private sendAuthorizationMessage(hashtag: string, step: string, auth: string): void {
    if (!this._websocketAvailable) {
      setTimeout(() => {
        this.sendAuthorizationMessage(hashtag, step, auth);
      }, 500);
      return;
    }
    this._socket.next({
      step: step, payload: {
        quizName: hashtag,
        webSocketAuthorization: auth
      }
    });
  }

  authorizeWebSocket(hashtag: string): void {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE', window.sessionStorage.getItem('config.websocket_authorization'));
  }

  authorizeWebSocketAsOwner(hashtag: string): void {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE_AS_OWNER', window.localStorage.getItem('config.private_key'));
  }

  initConnection(overrideCurrentState?: boolean): Promise<any> {
    return new Promise((resolve) => {
      if (this.serverAvailable && !overrideCurrentState) {
        resolve();
        return;
      }
      new Promise(resolve2 => {
        this.http.get(`${DefaultSettings.httpApiEndpoint}`).subscribe(
          (data) => {
            this.serverAvailable = true;
            this._websocketAvailable = true;
            setTimeout(this.calculateRTT.bind(this), 500);
            resolve2(data);
          },
          () => {
            this.serverAvailable = false;
            this._websocketAvailable = false;
            resolve2();
          }
        );
      }).then((data) => {
        resolve(data);
      });
    });
  }

  calculateConnectionSpeedIndicator() {
    if (this._rtt > 800) {
      this._lowSpeed = true;
      this._mediumSpeed = false;
    } else if (this._rtt > 300) {
      this._lowSpeed = false;
      this._mediumSpeed = true;
    } else {
      this._lowSpeed = false;
      this._mediumSpeed = false;
    }
  }

  calculateRTT() {
    const start_time = new Date().getTime();
    this.http.get(`${DefaultSettings.httpApiEndpoint}`).subscribe(
      () => {
        this.serverAvailable = true;
        this._rtt = new Date().getTime() - start_time;
        this.calculateConnectionSpeedIndicator();
      },
      () => {
        this.serverAvailable = false;
        this._websocketAvailable = false;
        this._socket = null;
      }
    );
  }
}
