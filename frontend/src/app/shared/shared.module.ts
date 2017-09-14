import {ModuleWithProviders, NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslatePipe, TranslateService} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { RouterModule } from '@angular/router';

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
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    NgbModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslatePipe,
    TranslateModule,
    NgbModule,
    RouterModule
  ],
  providers: [],
  declarations: [],
  bootstrap: []
})
export class SharedModule {

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }

  static forRoot() : ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...providers]
    };
  }
}
