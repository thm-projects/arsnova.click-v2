import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private _errorMap = [];

  constructor(private injector: Injector, private zone: NgZone, private translateService: TranslateService) {
    window.addEventListener('error', this.handleError, { passive: true });
    window.onerror = this.handleError;
  }

  public handleError(evt: any): void {
    const location = this.injector.get(LocationStrategy);

    this._errorMap.push({
      msg: evt.message,
      line: evt.lineno,
      file: evt.filename,
      type: evt.type,
      elem: (
        evt.srcElement || evt.target
      ),
      url: location instanceof PathLocationStrategy ? location.path() : '',
    });
  }

  public onZoneError(error): void {
    this.handleError(error);
  }

}

/*

 window.addEventListener('error', (event: ErrorEvent) => {
 console.log('error triggered');
 const string = event.message.toLowerCase();
 const substring = 'script error';
 if (string.indexOf(substring) > -1) {
 console.log('Script Error: See Browser Console for Detail');
 } else {
 const msg = [
 'Message: ' + event.message,
 'URL: ' + event.filename,
 'Line: ' + event.lineno,
 'Column: ' + event.colno,
 'Error object: ' + JSON.stringify(event.error),
 ].join(' - ');

 console.log(msg);
 }

 return false;
 });

 window.onerror = () => {
 console.log('error');
 };
 */
