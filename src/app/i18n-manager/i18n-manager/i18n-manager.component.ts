import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs/index';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ModalOrganizerService } from '../../service/modal-organizer/modal-organizer.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { FILTER, PROJECT } from '../../shared/enums';

@Component({
  selector: 'app-fe-translation',
  templateUrl: './i18n-manager.component.html',
  styleUrls: ['./i18n-manager.component.scss'],
})
export class I18nManagerComponent implements OnInit, OnDestroy {

  public static readonly TYPE = 'I18nManagerComponent';
  public readonly filters = FILTER;

  private _langRef = ['en', 'de', 'fr', 'it', 'es'];

  get langRef(): Array<string> {
    return this._langRef;
  }

  private _selectedKey: { key: string, value: string };

  get selectedKey(): { key: string; value: string } {
    return this._selectedKey;
  }

  private _changedData = false;

  get changedData(): boolean {
    return this._changedData;
  }

  private _searchFilter = '';

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(value: string) {
    this._searchFilter = value;
  }

  private _filter = FILTER.NONE;

  get filter(): FILTER {
    return this._filter;
  }

  set filter(value: FILTER) {
    this.hasAnyMatches = of(false);
    switch (parseInt(String(value), 10)) {
      case 0:
        this._filter = FILTER.NONE;
        return;
      case 1:
        this._filter = FILTER.UNUSED;
        return;
      case 2:
        this._filter = FILTER.INVALID_KEYS;
        return;
      case 3:
        this._filter = FILTER.INVALID_DE;
        return;
      case 4:
        this._filter = FILTER.INVALID_EN;
        return;
      case 5:
        this._filter = FILTER.INVALID_ES;
        return;
      case 6:
        this._filter = FILTER.INVALID_FR;
        return;
      case 7:
        this._filter = FILTER.INVALID_IT;
        return;
      default:
        throw Error(`Unknown filter set: ${value}`);
    }
  }

  private _hasAnyMatches = of(false);

  get hasAnyMatches(): Observable<boolean> {
    return this._hasAnyMatches;
  }

  set hasAnyMatches(value: Observable<boolean>) {
    this._hasAnyMatches = value;
  }

  constructor(private footerBarService: FooterBarService, private headerLabelService: HeaderLabelService,
              public modalOrganizerService: ModalOrganizerService, public projectLoaderService: ProjectLoaderService,
              private languageLoaderService: LanguageLoaderService,
  ) {
    this.headerLabelService.headerLabel = 'I18Nator';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this.setProject(PROJECT.FRONTEND);
    document.getElementById('content-container').classList.remove('container');
    document.getElementById('content-container').classList.add('container-fluid');
  }

  public ngOnDestroy(): void {
    document.getElementById('content-container').classList.add('container');
    document.getElementById('content-container').classList.remove('container-fluid');
  }

  public updateData(): void {
    this.languageLoaderService.updateProject();
    this._changedData = false;
  }

  public changeFilter(filter: number): void {
    this.filter = filter;
    this._selectedKey = null;
  }

  public setProject(value: PROJECT): void {
    this._selectedKey = undefined;
    this.languageLoaderService.reset();
    this.projectLoaderService.currentProject = value;
    this.reloadLanguageData();
  }

  public dataChanged(key): void {
    this._selectedKey = key;
  }

  public getKeys(dataNode: Array<string>): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

  public updateKey(event, langRef, key): void {
    const value = event.target.value;

    this._changedData = true;

    if (!value.length) {
      delete key.value[langRef];

    } else {
      key.value[langRef] = value;

    }

  }

  private reloadLanguageData(): void {
    this.languageLoaderService.getLangData();
  }

}
