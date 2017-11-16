import {Injectable} from '@angular/core';

declare global {
  interface Window {
    _paq: any;
  }
}

@Injectable()
export class TrackingService {

  private dataLayer = window._paq;

  constructor() {
  }

  trackPageView(pageName: string) {
    this.dataLayer.push(['setDocumentTitle', pageName]);
    this.dataLayer.push(['trackPageView']);
  }

  trackClickEvent(action: string, label: string, value?: any) {
    this.dataLayer.push(['trackEvent', 'click', action, label, value]);
  }

}
