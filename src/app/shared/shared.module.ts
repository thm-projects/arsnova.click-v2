import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../lib/translation.factory';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { GamificationAnimationComponent } from './gamification-animation/gamification-animation.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    NgbModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslatePipe,
    TranslateModule,
    NgbModule,
    RouterModule,
    AudioPlayerComponent,
    GamificationAnimationComponent,
  ],
  providers: [TranslateModule],
  declarations: [AudioPlayerComponent, GamificationAnimationComponent],
  bootstrap: [],
})
export class SharedModule {
  constructor() {}
}
