import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';
import { TranslateCompiler, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as MessageFormat from 'messageformat';
import { MessageFormatConfig, TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateUniversalLoader } from './translate-universal-loader';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function createUniversalTranslateLoader(transferState: TransferState, platformId: object, http: HttpClient): TranslateLoader {
  return new TranslateUniversalLoader(isPlatformServer(platformId), transferState, http);
}

export function createTranslateCompiler(): TranslateCompiler {
  return new TranslateMessageFormatCompiler(new MessageFormat() as unknown as MessageFormatConfig);
}
