// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import 'zone.js/dist/zone-testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

/**
 * Then we find all the tests.
 * In case this stuff failes again without error, use this code to walk through all components step by step until the tests begin to fail:
 * @see https://github.com/angular/angular-cli/issues/10485
 *
 * Example: /(footer.*|header.*)\.spec\.ts$/
 */
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
