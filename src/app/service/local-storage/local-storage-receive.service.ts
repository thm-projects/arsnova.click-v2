import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageReceiveService {

  constructor(private window: Window) {
    //Ping parent until response, then ask for data
    //Pings parent window and asks for response with key and value of "Language"

    if (window === undefined) {
      console.log('Could not use window object!');
      return;
    }

    window.parent.postMessage(JSON.stringify({
      action: 'get',
      key: 'Language'
    }), '*');

    window.parent.postMessage(JSON.stringify({
      action: 'get',
      key: 'Theme'
    }), '*');

    window.addEventListener('message', this.messageHandler, false);
  }


  messageHandler(event) {
    const { action, key, value } = JSON.parse(event.data);
    if ( action == 'returnData') {
      this.useData(key, value)
    }
  }

  useData(key, value) {
    window.localStorage.setItem(key, value);
  }

  //TODO: Listener on localStorage language and localstorage Theme which react when theyre being changed
}
