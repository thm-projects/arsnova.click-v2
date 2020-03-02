import { HttpClient } from '@angular/common/http';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

export class TranslateUniversalLoader implements TranslateLoader {

  constructor(
    private isServer: boolean,
    private transferState: TransferState,
    private http: HttpClient,
    private prefix: string = './assets/i18n/',
    private suffix: string = '.json',
  ) {
  }

  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);

    const data = this.transferState.get(key, null);

    if (!data && !this.isServer) {
      return new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
    } else {
      return new Observable<any>(observer => {
        if (this.isServer) {
          const fs = require('fs');
          const path = require('path');

          const assets_folder = path.join(process.cwd(), 'dist', 'frontend', 'browser', this.prefix);
          const jsonData = JSON.parse(fs.readFileSync(`${assets_folder}${lang}${this.suffix}`, 'utf8'));

          this.transferState.set(key, jsonData);
        } else {
          console.log('having data and not server', this.transferState.get(key, null));
        }

        observer.next(this.transferState.get(key, null));
        observer.complete();
      });
    }
  }
}
