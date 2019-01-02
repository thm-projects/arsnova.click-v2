import { Injectable } from '@angular/core';
import { Language, LanguageTranslation } from '../../../lib/enums/enums';
import { StatusProtocol } from '../../../lib/enums/Message';
import { I18nManagerApiService } from '../api/i18n-manager/i18n-manager-api.service';
import { ProjectLoaderService } from '../project-loader/project-loader.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageLoaderService {
  public readonly language = Language;
  public readonly languageTranslation = LanguageTranslation;

  private _parsedLangData = [];

  get parsedLangData(): Array<any> {
    return this._parsedLangData;
  }

  private _unusedKeys = [];

  get unusedKeys(): Array<string> {
    return this._unusedKeys;
  }

  constructor(private i18nManagerService: I18nManagerApiService, private projectLoaderService: ProjectLoaderService) {
  }

  public reset(): void {
    this._parsedLangData = [];
  }

  public getLangData(): void {
    console.log('getting langfile for project', this.projectLoaderService.currentProject);
    this.i18nManagerService.getLangFileForProject(this.projectLoaderService.currentProject).subscribe((response: any) => {
      if (response.status !== StatusProtocol.Success) {
        this.projectLoaderService.connected = false;
        return;
      }
      this.projectLoaderService.connected = true;
      this._parsedLangData = response.payload.langData;
      this._unusedKeys = response.payload.unused;
    });
  }

  public updateProject(): void {
    this.i18nManagerService.postUpdateLangForProject(this.projectLoaderService.currentProject, this.parsedLangData).subscribe((response: any) => {
      if (response.status !== StatusProtocol.Success) {
        console.log(response);
      }
    });
  }
}
