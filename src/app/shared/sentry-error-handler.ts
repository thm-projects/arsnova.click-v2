import { ErrorHandler, Injectable } from '@angular/core';
import { captureException, init as SentryInit, showReportDialog } from '@sentry/browser';
import { environment } from '../../environments/environment';

if (environment.production) {
  SentryInit({
    dsn: 'https://f16c02fdefe64c018f5d580d1cf05b56@sentry.io/1819496',
  });
}

@Injectable({ providedIn: 'root' })
export class SentryErrorHandler implements ErrorHandler {

  constructor() {}

  public handleError(error): void {
    if (!environment.production) {
      return;
    }

    const eventId = captureException(error.originalError || error);
    showReportDialog({ eventId });
  }
}
