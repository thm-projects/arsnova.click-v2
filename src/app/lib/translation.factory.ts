import { HttpClient } from '@angular/common/http';
import { TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import MessageFormat from 'messageformat';
import { MessageFormatConfig, TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function createTranslateCompiler(): TranslateCompiler {
  return new TranslateMessageFormatCompiler(new MessageFormat() as MessageFormatConfig);
}
