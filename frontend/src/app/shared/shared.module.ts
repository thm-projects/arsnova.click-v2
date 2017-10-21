import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import * as MessageFormat from 'messageformat';
import {I18nService} from '../service/i18n.service';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {GamificationAnimationComponent} from './gamification-animation/gamification-animation.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function CustomCompilerFactory() {
  return new TranslateMessageFormatCompiler(new MessageFormat());
}

export const providers = [
  BrowserModule,
  CommonModule,
  FormsModule,
  HttpClientModule,
  TranslateModule,
  NgbModule,
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useFactory: CustomCompilerFactory
      }
    }),
    NgbModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslatePipe,
    TranslateModule,
    NgbModule,
    RouterModule,
    AudioPlayerComponent,
    GamificationAnimationComponent
  ],
  providers: [],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent],
  bootstrap: []
})
export class SharedModule {
  constructor(private I18nService: I18nService) {
  }
}
