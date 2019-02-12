import { isPlatformServer } from '@angular/common';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DefaultSettings } from '../../../lib/default.settings';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { IMessage } from '../../../lib/interfaces/communication/IMessage';
import { StatisticsApiService } from '../api/statistics/statistics-api.service';
import { SharedService } from '../shared/shared.service';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class ConnectionService {
  public readonly dataEmitter: EventEmitter<IMessage> = new EventEmitter<IMessage>();

  private _socket: WebSocket;

  get socket(): WebSocket | any {
    return this._socket;
  }

  private _serverAvailable: boolean;

  get serverAvailable(): boolean {
    return this._serverAvailable;
  }

  set serverAvailable(value: boolean) {
    this._serverAvailable = value;
  }

  private _websocketAvailable = false;

  get websocketAvailable(): boolean {
    return this._websocketAvailable;
  }

  set websocketAvailable(value: boolean) {
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

  private lastTimeout = 500;
  private _isWebSocketAuthorized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private websocketService: WebsocketService,
    private sharedService: SharedService,
    private statisticsApiService: StatisticsApiService,
  ) {
    this.initWebsocket();
    this.dataEmitter.subscribe((data: IMessage) => {
      if (data.status === StatusProtocol.Success && data.step === MessageProtocol.Connected && data.payload.activeQuizzes) {
        this.parseActiveQuizzes(data);
      }
    });
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
    this._socket.send(JSON.stringify(message));
  }

  public initConnection(overrideCurrentState?: boolean): Promise<any> {
    if (isPlatformServer(this.platformId)) {
      return new Promise<any>(resolve => resolve());
    }

    return new Promise(async (resolve) => {
      if ((this.pending || this.serverAvailable) && !overrideCurrentState) {
        resolve();
        return;
      }
      this.pending = true;
      const data = await new Promise(resolve2 => {
        this.statisticsApiService.getBaseStatistics().subscribe(httpData => {
          this.pending = false;
          this.serverAvailable = true;
          setTimeout(() => {
            this.calculateRTT(new Date().getTime());
          }, 500);
          resolve2(httpData);
        }, () => {
          this.pending = false;
          this.serverAvailable = false;
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
    });
  }

  public connectToChannel(name: string): void {
    console.log('connecting to channel', name);
    if (!this._socket) {
      console.error('cannot connect to channel since no socket was found');
      return;
    }

    if (!this._websocketAvailable) {
      setTimeout(() => {
        console.log('connectionservice - websocket not available, waiting 500ms');
        this.connectToChannel(name);
      }, 500);
      return;
    }
    this.sendMessage({
      step: MessageProtocol.Connect,
      payload: {
        name,
      },
    });
  }

  public disconnectFromChannel(): void {
    if (!this._socket) {
      console.error('cannot disconnect from channel since no socket was found');
      return;
    }

    if (!this._websocketAvailable) {
      setTimeout(() => {
        console.log('connectionservice - websocket not available, waiting 500ms');
        this.disconnectFromChannel();
      }, 500);
      return;
    }
    this.sendMessage({
      step: MessageProtocol.Disconnect,
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
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this._socket = new WebSocket(DefaultSettings.wsApiEndpoint);
    this._socket.onopen = () => {
      this._websocketAvailable = true;
      this._serverAvailable = true;
    };
    this._socket.onmessage = data => {
      try {
        const parsedData = JSON.parse(data.data);
        this.dataEmitter.emit(parsedData);
      } catch (ex) {
        console.error(ex);
      }
    };
    this._socket.onerror = err => {
      console.error(err);
    };
    this._socket.onclose = () => {
      this._websocketAvailable = false;
      this._serverAvailable = false;
      const timeout = this.lastTimeout * 2;
      this.lastTimeout = timeout;
      console.log(`Socket connection dropped, waiting ${timeout}ms for reconnect`);
      setTimeout(() => {
        this.initWebsocket();
      }, timeout);
    };
  }

  private parseActiveQuizzes(val): void {
    if (val.payload && val.payload.activeQuizzes) {
      this.sharedService.activeQuizzes = [...val.payload.activeQuizzes];
    }
  }
}
