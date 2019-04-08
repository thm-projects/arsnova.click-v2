import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { RootModule } from './root.module';
import { RootComponent } from './root/root/root.component';

@NgModule({
  imports: [
    RootModule, ServerModule, ModuleMapLoaderModule, ServerTransferStateModule,
  ],
  providers: [
    // Add universal-only providers here
  ],
  bootstrap: [RootComponent],
})
export class RootServerModule {
}
