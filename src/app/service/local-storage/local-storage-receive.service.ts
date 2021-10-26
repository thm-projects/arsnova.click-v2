import { Injectable } from '@angular/core';
import { NotifierService } from './../../service/notification/notifier.service'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageReceiveService {

  constructor(private notifier: NotifierService) {
    //Pings parent window and asks for response with key and value of "Language"
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
    this.notifier.show(key);
    window.localStorage.setItem(key, value);
  }

  //TODO: Listener on localStorage language and localstorage Theme which react when theyre being changed
}
