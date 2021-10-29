import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageReceiveService {

  constructor() {
    //Pings parent window and asks for response with key and value of "Language"
    window.parent.postMessage({
      action: 'get',
      key: 'Language'
    }, 'http://staging.frag.jetzt');

    window.parent.postMessage({
      action: 'get',
      key: 'Theme'
    }, 'http://staging.frag.jetzt');

    window.addEventListener('message', this.messageHandler, false);
  }


  messageHandler(event) {
    const { action, key, value } = event.data;
    if ( action == 'returnData') {
      this.useData(key, value)
    }
  }

  useData(key, value) {
    window.localStorage.setItem(key, value);
  }

  //TODO: Listener on localStorage language and localstorage Theme which react when theyre being changed
}
