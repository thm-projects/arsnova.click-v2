import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable()
export class WebsocketService {

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
    const observable = Observable.create(
      (obsvr: Observer<MessageEvent>) => {
        socket.onmessage = obsvr.next.bind(obsvr);
        socket.onerror = obsvr.error.bind(obsvr);
        socket.onclose = obsvr.complete.bind(obsvr);
        return socket;
      },
    );
    const observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        } else if (socket.readyState === WebSocket.CONNECTING) {
          console.log('websocketservice - waiting 500ms for connection');
          setTimeout(() => (observer.next(data)), 500);
        }
      },
    };
    return Subject.create(observer, observable);
  }

}
