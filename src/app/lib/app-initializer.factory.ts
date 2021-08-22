import { isPlatformBrowser, isPlatformServer, LOCATION_INITIALIZED, ɵgetDOM } from '@angular/common';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './enums/enums';

export const AppInitializerFactory = (platformId: object, translate: TranslateService, injector: Injector) => () => {
  if (isPlatformServer(platformId)) {
    return;
  }

  return new Promise(resolve => {
    const dom = ɵgetDOM();
    const styles = Array.prototype.slice.apply(
      dom.getDefaultDocument().querySelectorAll('style[ng-transition]'),
    );
    styles.forEach(el => {
      // Remove ng-transition attribute to prevent Angular appInitializerFactory
      // to remove server styles before preboot complete
      el.removeAttribute('ng-transition');
    });
    dom.getDefaultDocument().addEventListener('PrebootComplete', () => {
      // After preboot complete, remove the server scripts
      styles.forEach(el => dom.remove(el));
    });

    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    return locationInitialized.then(locationInittializedHandler(translate, resolve));
  });
};

function locationInittializedHandler(translate: TranslateService, resolve: Function): () => void {
  return () => {
    const lang = navigator.language.match(/([A-Z]{2})/i);
    let langToSet: string;
    if (!Array.isArray(lang) || !lang[0] || !Language[lang[0].toUpperCase()]) {
      langToSet = Language.EN;
    } else {
      langToSet = lang[0].toLowerCase();
    }
    translate.setDefaultLang(langToSet);
    translate.use(langToSet).subscribe(() => {
    }, err => {
      console.error(`Problem with '${langToSet}' language initialization.'`, err);
    }, () => {
      resolve(null);
    });
  };
}
