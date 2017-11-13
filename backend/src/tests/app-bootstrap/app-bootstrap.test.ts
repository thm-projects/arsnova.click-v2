// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import {createDefaultPaths} from '../../app_bootstrap';

@suite class AppBootstrapRouterTestSuite {

  @test async ensureDefaultPathsExist() {
    createDefaultPaths();
  }
}
