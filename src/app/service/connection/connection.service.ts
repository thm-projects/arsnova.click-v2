import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { SimpleMQ } from 'ng2-simple-mq';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageProtocol } from '../../lib/enums/Message';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { StatisticsApiService } from '../api/statistics/statistics-api.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private _serverAvailable: boolean;
  private _websocketAvailable = false;
  private _serverStatusEmitter = new ReplaySubject<boolean>(1);
  private _rtt = 0;
  private _lowSpeed = false;
  private _mediumSpeed = false;
  private _pending = false;
  private _isWebSocketAuthorized = false;

  public readonly dataEmitter: ReplaySubject<IMessage> = new ReplaySubject<IMessage>();

  get serverAvailable(): boolean {
    return this._serverAvailable;
  }

  set serverAvailable(value: boolean) {
    this._serverAvailable = value;
    this._serverStatusEmitter.next(value);
  }

  get websocketAvailable(): boolean {
    return this._websocketAvailable;
  }

  get serverStatusEmitter(): ReplaySubject<boolean> {
    return this._serverStatusEmitter;
  }

  get rtt(): number {
    return this._rtt;
  }

  get lowSpeed(): boolean {
    return this._lowSpeed;
  }

  get mediumSpeed(): boolean {
    return this._mediumSpeed;
  }

  get pending(): boolean {
    return this._pending;
  }

  set pending(value: boolean) {
    this._pending = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sharedService: SharedService,
    private statisticsApiService: StatisticsApiService,
    private rxStompService: RxStompService,
    private messageQueue: SimpleMQ,
  ) {
    this.initWebsocket();
  }

  public cleanUp(): Observable<boolean> {
    this._isWebSocketAuthorized = false;

    return new Observable(subscriber => subscriber.next(true));
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

  public initWebsocket(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.rxStompService.connectionState$.subscribe(value => {
      switch (value) {
        case RxStompState.OPEN:
          this._websocketAvailable = true;
          break;
        case RxStompState.CLOSED:
          this._websocketAvailable = false;
          break;
      }
    });
  }

  public connectToGlobalChannel(): Observable<any> {
    return this.rxStompService.watch(encodeURI(`/exchange/global`)).pipe(tap(message => {
      console.log('Message in global channel received', message);
      try {
        const parsedMessage = JSON.parse(message.body);
        switch (parsedMessage.step) {
          case MessageProtocol.SetActive:
            if (!this.sharedService.activeQuizzes.includes(parsedMessage.payload.quizName)) {
              this.sharedService.activeQuizzes.push(parsedMessage.payload.quizName);
            }
            this.sharedService.activeQuizzesChanged.next();
            break;
          case MessageProtocol.SetInactive:
            const index = this.sharedService.activeQuizzes.indexOf(parsedMessage.payload.quizName);
            if (index > -1) {
              this.sharedService.activeQuizzes.splice(index, 1);
            }
            this.sharedService.activeQuizzesChanged.next();
            break;
          default:
            console.log('Publishing message to queue', parsedMessage.step, parsedMessage.payload || {});
            this.messageQueue.publish(parsedMessage.step, parsedMessage.payload || {}, false);
            break;
        }
      } catch (ex) {
        console.error('Invalid message received', ex);
      }
    }));
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
}
