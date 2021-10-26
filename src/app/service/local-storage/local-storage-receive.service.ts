import { Injectable } from '@angular/core';
import { ThemeSwitcherComponent } from 'src/app/root/theme-switcher/theme-switcher.component';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageReceiveService {

  constructor(private themeSwitcher: ThemeSwitcherComponent) {
    //Pings parent window and asks for response with key and value of "Language"
    window.parent.postMessage({
      action: 'get',
      key: 'Language'
    }, 'https://frag.jetzt');

    window.parent.postMessage({
      action: 'get',
      key: 'Theme'
    }, 'https://frag.jetzt');

    window.addEventListener('message', this.messageHandler, false);
  }


  messageHandler(event) {
    const { action, key, value } = event.data;
    if ( action == 'returnData') {
      this.useData(key, value)
    }
  }

  useData(key, value) {
    console.log(key); //TODO: erase
    window.localStorage.setItem(key, value);
    this.themeSwitcher.trigger();
  }
}
