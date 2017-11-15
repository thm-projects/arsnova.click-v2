import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {DefaultSettings} from '../../lib/default.settings';

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
    const socket = new WebSocket(this.url);
    const observable = Observable.create(
      (obsvr: Observer<MessageEvent>) => {
        socket.onmessage = obsvr.next.bind(obsvr);
        socket.onerror = obsvr.error.bind(obsvr);
        socket.onclose = obsvr.complete.bind(obsvr);
        return socket;
      }
    );
    const observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        } else if (socket.readyState === WebSocket.CONNECTING) {
          setTimeout(() => observer.next(data), 500);
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
