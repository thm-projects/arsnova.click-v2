import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { SharedService } from '../shared/shared.service';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class ConnectionService {
  private _socket: Subject<IMessage>;

  get socket(): Subject<IMessage> | any {
    if (!this._socket) {
      return { subscribe: () => {} };
    }
    return this._socket;
  }

  private _serverAvailable: Boolean;

  get serverAvailable(): Boolean {
    return this._serverAvailable;
  }

  set serverAvailable(value: Boolean) {
    this._serverAvailable = value;
  }

  private _websocketAvailable: Boolean = false;

  get websocketAvailable(): Boolean {
    return this._websocketAvailable;
  }

  set websocketAvailable(value: Boolean) {
    this._websocketAvailable = value;
  }

  private _rtt = 0;

  get rtt(): number {
    return this._rtt;
  }

  private _lowSpeed = false;

  get lowSpeed(): boolean {
    return this._lowSpeed;
  }

  private _mediumSpeed = false;

  get mediumSpeed(): boolean {
    return this._mediumSpeed;
  }

  private _isWebSocketAuthorized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private websocketService: WebsocketService,
    private http: HttpClient,
    private sharedService: SharedService,
  ) {
    this.initWebsocket();
  }

  public cleanUp(): void {
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

  public authorizeWebSocket(hashtag: string): void {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE', window.sessionStorage.getItem('config.websocket_authorization'));
  }

  public authorizeWebSocketAsOwner(hashtag: string): void {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE_AS_OWNER', window.localStorage.getItem('config.private_key'));
  }

  public initConnection(overrideCurrentState?: boolean): Promise<any> {
    return new Promise(async (resolve) => {
      if (this.serverAvailable && !overrideCurrentState) {
        resolve();
        return;
      }
      const data = await new Promise(resolve2 => {
        this.http.get(`${DefaultSettings.httpApiEndpoint}`).subscribe(
          (httpData) => {
            this.serverAvailable = true;
            this._websocketAvailable = true;
            setTimeout(this.calculateRTT.bind(this), 500);
            resolve2(httpData);
          },
          () => {
            this.serverAvailable = false;
            this._websocketAvailable = false;
            resolve2();
          },
        );
      });
      resolve(data);
    });
  }

  public calculateRTT(): void {
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
      },
    );
  }

  private calculateConnectionSpeedIndicator(): void {
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

  private initWebsocket(): void {
    const defaultSocket = <Subject<MessageEvent>>this.websocketService.connect();

    if (defaultSocket) {
      this._socket = <Subject<IMessage>>defaultSocket.pipe(map((response: MessageEvent): IMessage => {
        const parsedResponse = JSON.parse(response.data);
        this._websocketAvailable = true;

        if (parsedResponse.payload && parsedResponse.payload.activeQuizzes) {
          this.sharedService.activeQuizzes = [...parsedResponse.payload.activeQuizzes];
        }

        return parsedResponse;
      }));
    }
  }

  private sendAuthorizationMessage(hashtag: string, step: string, auth: string): void {
    if (!this._socket) {
      return;
    }

    if (!this._websocketAvailable) {
      setTimeout(() => {
        this.sendAuthorizationMessage(hashtag, step, auth);
      }, 500);
      return;
    }
    this._socket.next({
      step: step, payload: {
        quizName: hashtag,
        webSocketAuthorization: auth,
      },
    });
  }
}
