import { Injectable, Component } from '@angular/core';

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

}
