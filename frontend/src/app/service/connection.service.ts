import {Injectable} from '@angular/core';
import {DefaultSettings} from './settings.service';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from './websocket.service';
import {Subject} from 'rxjs/Subject';
import {IMessage} from '../quiz/quiz-flow/quiz-lobby/quiz-lobby.component';

@Injectable()
export class ConnectionService {
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
  private _httpApiEndpoint = `${DefaultSettings.httpApiEndpoint}/`;
  private _isWebSocketAuthorized = false;

  constructor(
    private websocketService: WebsocketService,
    private http: HttpClient) {
    this.initConnection();
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
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE', window.sessionStorage.getItem('webSocketAuthorization'));
  }

  authorizeWebSocketAsOwner(hashtag: string): void {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, 'WEBSOCKET:AUTHORIZE_AS_OWNER', window.localStorage.getItem('config.private_key'));
  }

  initConnection(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>((resolve, reject) => {
      if (self.serverAvailable) {
        resolve();
      }
      self.http.get(`${self._httpApiEndpoint}`).subscribe(
        () => {
          self.serverAvailable = true;
          resolve();
        },
        () => {
          self.serverAvailable = false;
          self._websocketAvailable = false;
          //reject();
        }
      );
    });
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
}
