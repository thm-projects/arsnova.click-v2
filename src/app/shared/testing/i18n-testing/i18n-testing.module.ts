import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../../_mocks/_services/TranslateServiceMock';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    TranslateStore, {
      provide: TranslateLoader,
      useClass: TranslateFakeLoader,
    }, {
      provide: TranslateCompiler,
      useClass: TranslateFakeCompiler,
    }, {
      provide: TranslateParser,
      useClass: TranslateDefaultParser,
    }, {
      provide: MissingTranslationHandler,
      useClass: FakeMissingTranslationHandler,
    }, {
      provide: USE_DEFAULT_LANG,
      useValue: 'en',
    }, {
      provide: USE_STORE,
      useValue: '',
    }, {
      provide: USE_EXTEND,
      useValue: '',
    }, {
      provide: TranslateService,
      useClass: TranslateServiceMock,
    },
  ],
})
export class I18nTestingModule {
}
