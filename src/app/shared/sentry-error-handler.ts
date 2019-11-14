import { ErrorHandler, Injectable } from '@angular/core';
import { captureException, init as SentryInit, setExtra, showReportDialog } from '@sentry/browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SentryErrorHandler implements ErrorHandler {
  private readonly _enabled = environment.production && environment.sentryDSN && !['localhost', '127.0.0.1'].includes(location.hostname);

  constructor() {
    if (!environment.sentryDSN) {
      return;
    }

    SentryInit({
      dsn: environment.sentryDSN,
      enabled: this._enabled,
      release: environment.version,
    });

    setExtra('nonErrorException', true);
  }

  public handleError(error): void {
    if (!this._enabled) {
      return;
    }

    const eventId = captureException(error.originalError || error);
    showReportDialog({ eventId });
  }
}
