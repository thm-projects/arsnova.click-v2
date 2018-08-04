import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IMessage, IMessageStep } from 'arsnova-click-v2-types/dist/common';
import { COMMUNICATION_PROTOCOL } from 'arsnova-click-v2-types/dist/communication_protocol';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { StatisticsApiService } from '../api/statistics/statistics-api.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class ConnectionService {
  private _socket: Subject<IMessage>;

  get socket(): Subject<IMessage> | any {
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

  private _pending = false;

  get pending(): boolean {
    return this._pending;
  }

  set pending(value: boolean) {
    this._pending = value;
  }

  private _isWebSocketAuthorized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private websocketService: WebsocketService,
    private sharedService: SharedService,
    private statisticsApiService: StatisticsApiService,
    private storageService: StorageService,
  ) {
    this.initWebsocket();
  }

  public cleanUp(): void {
    this._isWebSocketAuthorized = false;
  }

  public sendMessage(message: IMessage): void {
    if (!this._websocketAvailable) {
      console.log('connectionservice - websocket not available, waiting 500ms');
      setTimeout(() => {
        this.sendMessage(message);
      }, 500);
      return;
    }
    this._socket.next(message);
  }

  public async authorizeWebSocket(hashtag: string): Promise<void> {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, COMMUNICATION_PROTOCOL.AUTHORIZATION.AUTHENTICATE,
      await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.WEBSOCKET_AUTHORIZATION).toPromise());
  }

  public async authorizeWebSocketAsOwner(hashtag: string): Promise<void> {
    if (this._isWebSocketAuthorized) {
      return;
    }
    this._isWebSocketAuthorized = true;
    this.sendAuthorizationMessage(hashtag, COMMUNICATION_PROTOCOL.AUTHORIZATION.AUTHENTICATE_AS_OWNER,
      await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.PRIVATE_KEY).toPromise());
  }

  public initConnection(overrideCurrentState?: boolean): Promise<any> {
    if (isPlatformServer(this.platformId)) {
      return new Promise<any>(resolve => resolve());
    }

    return new Promise(async (resolve) => {
      if ((
            this.pending || this.serverAvailable
          ) && !overrideCurrentState) {
        resolve();
        return;
      }
      this.pending = true;
      const data = await new Promise(resolve2 => {
        this.statisticsApiService.getBaseStatistics().subscribe(httpData => {
          this.pending = false;
          this.serverAvailable = true;
          this._websocketAvailable = true;
          setTimeout(() => {
            console.log('connectionservice - websocket not available, waiting 500ms');
            this.calculateRTT(new Date().getTime());
          }, 500);
          resolve2(httpData);
        }, () => {
          this.pending = false;
          this.serverAvailable = false;
          this._websocketAvailable = false;
          resolve2();
        });
      });
      resolve(data);
    });
  }

  public calculateRTT(startTime = new Date().getTime()): void {
    this.statisticsApiService.optionsBaseStatistics().subscribe(() => {
      this.serverAvailable = true;
      this._rtt = new Date().getTime() - startTime;
      this.calculateConnectionSpeedIndicator();
    }, () => {
      this.serverAvailable = false;
      this._websocketAvailable = false;
      this._socket = null;
    });
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
        console.log('connectionservice - received message', parsedResponse);
        this._websocketAvailable = true;

        if (parsedResponse.payload && parsedResponse.payload.activeQuizzes) {
          this.sharedService.activeQuizzes = [...parsedResponse.payload.activeQuizzes];
        }

        return parsedResponse;
      }));
    }
  }

  private sendAuthorizationMessage(hashtag: string, step: IMessageStep, auth: string): void {
    if (!this._socket) {
      return;
    }

    if (!this._websocketAvailable) {
      setTimeout(() => {
        console.log('connectionservice - websocket not available, waiting 500ms');
        this.sendAuthorizationMessage(hashtag, step, auth);
      }, 500);
      return;
    }
    this._socket.next({
      step,
      payload: {
        quizName: hashtag,
        webSocketAuthorization: auth,
      },
    });
  }
}
