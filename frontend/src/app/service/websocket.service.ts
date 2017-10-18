import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs/Rx';
import {DefaultSettings} from './settings.service';

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
      (observer: Observer<MessageEvent>) => {
        socket.onmessage = observer.next.bind(observer);
        socket.onerror = observer.error.bind(observer);
        socket.onclose = observer.complete.bind(observer);
        return socket.close.bind(socket);
      }
    );
    const observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
