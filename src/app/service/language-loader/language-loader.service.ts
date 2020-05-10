import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Language, LanguageTranslation } from '../../lib/enums/enums';
import { StatusProtocol } from '../../lib/enums/Message';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { I18nManagerApiService } from '../api/i18n-manager/i18n-manager-api.service';
import { ProjectLoaderService } from '../project-loader/project-loader.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageLoaderService {
  private _parsedLangData = [];
  private _unusedKeys = [];
  private _changedData = false;

  public selectedKey: { key: string, value: { [key: string]: string } };
  public readonly language = Language;
  public readonly languageTranslation = LanguageTranslation;
  public readonly changed = new EventEmitter<void>();

  get parsedLangData(): Array<{ key: string, value: { [key: string]: string } }> {
    return this._parsedLangData;
  }

  get unusedKeys(): Array<string> {
    return this._unusedKeys;
  }

  get changedData(): boolean {
    return this._changedData;
  }

  set changedData(value: boolean) {
    this._changedData = value;
    this.changed.emit();
  }

  constructor(private i18nManagerService: I18nManagerApiService, private projectLoaderService: ProjectLoaderService) {
  }

  public reset(): void {
    this._parsedLangData = [];
  }

  public getLangData(): Observable<IMessage> {
    return this.i18nManagerService.getLangFileForProject(this.projectLoaderService.currentProject).pipe(tap((response: any) => {
      if (response.status !== StatusProtocol.Success) {
        this.projectLoaderService.connected = false;
        return;
      }
      this.projectLoaderService.connected = true;
      this._parsedLangData = response.payload.langData;
      this._unusedKeys = response.payload.unused;
      this._changedData = false;
    }));
  }

  public updateProject(): Observable<IMessage> {
    return this.i18nManagerService.postUpdateLangForProject(this.projectLoaderService.currentProject, this.parsedLangData)
      .pipe(tap((response: any) => {
        if (response.status !== StatusProtocol.Success) {
          console.log('LanguageLoaderService: PostUpdateLangForProject failed', response);
          return;
        }
        this._changedData = false;
      }));
  }
}
