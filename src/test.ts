// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
//const context = require.context('./app', true, /\.spec\.ts$/);
//const context = require('./app/root.component.spec.ts');
// And load the modules.
//context.keys().map(context);

/*
function importAll (r) {
  r.keys().forEach((el, i) => {
    r(el);
      console.log(i);
    if (i === r.keys().length - 1) {
      __karma__.start();
    }
  });
}

importAll(require.context('./app', true, /\.spec\.ts$/));
*/


const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
