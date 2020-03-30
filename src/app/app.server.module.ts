import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule, SvgLoader } from 'angular-svg-icon';
import { join } from 'path';
import { AppModule } from './app.module';
import { UniversalInterceptor } from './interceptors/universal.interceptor';
import { SvgServerLoader } from './lib/SvgServerLoader';
import { createTranslateCompiler, createUniversalTranslateLoader } from './lib/translation.factory';
import { RootComponent } from './root/root/root.component';
import { TrackingMockService } from './service/tracking/tracking.mock.service';
import { TrackingService } from './service/tracking/tracking.service';

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
    }), TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createUniversalTranslateLoader,
        deps: [TransferState, PLATFORM_ID, HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useFactory: createTranslateCompiler,
      },
    }), AppModule, ServerModule, ServerTransferStateModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true,
    }, {
      provide: TrackingService,
      useClass: TrackingMockService,
    },
  ],
  bootstrap: [RootComponent],
})
export class AppServerModule {
}
