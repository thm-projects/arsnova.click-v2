import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RootModule } from './app/root.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(RootModule).then(() => {
  if (environment.production && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(active => !active && navigator.serviceWorker.register('/ngsw-worker.js')).catch(console.error);
  }
});
