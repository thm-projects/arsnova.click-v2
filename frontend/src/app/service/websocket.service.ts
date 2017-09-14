import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';
import {DefaultSettings} from "./settings.service";

@Injectable()
export class WebsocketService {

  public createWebsocket(): Subject<MessageEvent> {
    let socket = new WebSocket(`${DefaultSettings.wsApiEndpoint}`);
    let observable = Observable.create(
      (observer: Observer<MessageEvent>) => {
        socket.onmessage = observer.next.bind(observer);
        socket.onerror = observer.error.bind(observer);
        socket.onclose = observer.complete.bind(observer);
        return socket.close.bind(socket);
      }
    );
    let observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
