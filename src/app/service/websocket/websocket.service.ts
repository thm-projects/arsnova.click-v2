import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable()
export class WebsocketService {

  public readonly connectionEmitter = new EventEmitter<boolean>();
  private subject: Subject<MessageEvent>;
  private url = DefaultSettings.wsApiEndpoint;

  public connect(): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create();
    }
    return this.subject;
  }

  private create(): Subject<MessageEvent> {
    let socket: WebSocket;

    try {
      socket = new WebSocket(this.url);
    } catch (e) {
      return null;
    }
    const observable = Observable.create((obsvr: Observer<MessageEvent>) => {
      socket.onmessage = () => {
        obsvr.next.bind(obsvr);
        this.connectionEmitter.emit(true);
      };
      socket.onerror = obsvr.error.bind(obsvr);
      socket.onclose = () => {
        obsvr.complete.bind(obsvr);
        this.connectionEmitter.emit(false);
      };
      return socket;
    });
    const observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log('websocketservice - sending message', data);
          socket.send(JSON.stringify(data));
          this.connectionEmitter.emit(true);
        } else if (socket.readyState === WebSocket.CONNECTING) {
          console.log('websocketservice - waiting 500ms for connection');
          setTimeout(() => (observer.next(data)), 500);
        } else if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
          this.connectionEmitter.emit(false);
        }
      },
    };
    return Subject.create(observer, observable);
  }
}
