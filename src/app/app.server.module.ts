import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AngularSvgIconModule, SvgLoader } from 'angular-svg-icon';
import { join } from 'path';
import { UniversalInterceptor } from './interceptors/universal-interceptor';
import { SvgServerLoader } from './lib/SvgServerLoader';

import { RootModule } from './root.module';
import { RootComponent } from './root/root/root.component';

export function svgLoaderFactory(http: HttpClient, transferState: TransferState): SvgServerLoader {
  return new SvgServerLoader(join(__dirname + '/../browser/assets/images'), transferState);
}

@NgModule({
  imports: [
    AngularSvgIconModule.forRoot({
      loader: {
        provide: SvgLoader,
        useFactory: svgLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }), RootModule, ServerModule, ServerTransferStateModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true,
    },
  ],
  bootstrap: [RootComponent],
})
export class AppServerModule {
}
