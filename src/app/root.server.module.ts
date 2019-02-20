import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { NgtPwaMockModule } from '@ng-toolkit/pwa';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { RootModule } from './root.module';
import { RootComponent } from './root/root/root.component';

@NgModule({
  imports: [
    NgtPwaMockModule, RootModule, ServerModule, ModuleMapLoaderModule,
  ],
  providers: [
    // Add universal-only providers here
  ],
  bootstrap: [RootComponent],
})
export class RootServerModule {
}
