import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {GamificationAnimationComponent} from './gamification-animation/gamification-animation.component';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {createTranslateLoader} from '../../lib/translation.factory';
import {I18nService, Languages} from '../service/i18n.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
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
  providers: [TranslateModule],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent],
  bootstrap: []
})
export class SharedModule {
  constructor(i18nService: I18nService) {
    i18nService.setLanguage(Languages.EN);
  }
}
