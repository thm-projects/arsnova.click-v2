import { isPlatformBrowser, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler, Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private _errorMap = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private injector: Injector) {

    if (isPlatformBrowser(this.platformId)) {
      // window.addEventListener('error', this.handleError, { passive: true });
      // window.onerror = this.handleError;
    }
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
