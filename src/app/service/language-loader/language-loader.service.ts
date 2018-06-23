import { Injectable } from '@angular/core';
import { LANGUAGE } from '../../shared/enums';
import { I18nManagerService } from '../api/i18n-manager/i18n-manager.service';
import { ProjectLoaderService } from '../project-loader/project-loader.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageLoaderService {
  public readonly LANGUAGE = LANGUAGE;

  private _parsedLangData = [];

  get parsedLangData(): Array<any> {
    return this._parsedLangData;
  }

  private _unusedKeys = {};

  get unusedKeys(): {} {
    return this._unusedKeys;
  }

  constructor(private i18nManagerService: I18nManagerService, private projectLoaderService: ProjectLoaderService) {
  }

  public reset(): void {
    this._parsedLangData = [];
  }

  public getLangData(): void {
    this.i18nManagerService.getLangFileForProject(this.projectLoaderService.currentProject).subscribe((response: any) => {
      if (response.status !== 'STATUS:SUCCESSFUL') {
        this.projectLoaderService.connected = false;
        return;
      }
      this.projectLoaderService.connected = true;
      this._parsedLangData = response.payload.langData;
      this._unusedKeys = response.payload.unused;
      this.projectLoaderService.currentBranch = response.payload.branch;
    });
  }

  public updateProject(): void {
    this.i18nManagerService.postUpdateLangForProject(this.projectLoaderService.currentProject, this.parsedLangData).subscribe((response: any) => {
      if (response.status !== 'STATUS:SUCCESSFUL') {
        console.log(response);
      }
    });
  }
}
