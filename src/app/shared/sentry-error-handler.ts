import { ErrorHandler, Injectable } from '@angular/core';
import { captureException, init as SentryInit, setExtra, showReportDialog } from '@sentry/browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SentryErrorHandler implements ErrorHandler {
  private readonly _enabled = environment.production && !['localhost', '127.0.0.1'].includes(location.hostname);

  constructor() {

    SentryInit({
      dsn: 'https://f16c02fdefe64c018f5d580d1cf05b56@sentry.io/1819496',
      enabled: this._enabled,
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
