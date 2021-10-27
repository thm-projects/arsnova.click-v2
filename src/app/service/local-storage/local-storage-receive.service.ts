import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageReceiveService {

  constructor() {
    window.parent.postMessage({
      action: 'get',
      key: 'Language'
    }, 'https://staging.frag.jetzt');

    window.parent.postMessage({
      action: 'get',
      key: 'Theme'
    }, 'https://staging.frag.jetzt');

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
