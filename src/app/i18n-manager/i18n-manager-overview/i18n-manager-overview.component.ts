import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter, Language, Project } from '../../../lib/enums/enums';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ModalOrganizerService } from '../../service/modal-organizer/modal-organizer.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-i18n-manager-overview',
  templateUrl: './i18n-manager-overview.component.html',
  styleUrls: ['./i18n-manager-overview.component.scss'],
})
export class I18nManagerOverviewComponent implements OnInit, OnDestroy {

  public static readonly TYPE = 'I18nManagerOverviewComponent';
  public readonly filters = Filter;

  private _langRef = Object.values(Language);

  get langRef(): Array<string> {
    return this._langRef;
  }

  private _selectedKey: { key: string, value: string };

  get selectedKey(): { key: string; value: string } {
    return this._selectedKey;
  }

  private _searchFilter = '';

  get searchFilter(): string {
    return this._searchFilter;
  }

  set searchFilter(value: string) {
    this._searchFilter = value;
  }

  private _filter = Filter.None;

  get filter(): Filter {
    return this._filter;
  }

  set filter(value: Filter) {
    this.hasAnyMatches = of(false);
    switch (parseInt(String(value), 10)) {
      case 0:
        this._filter = Filter.None;
        return;
      case 1:
        this._filter = Filter.Unused;
        return;
      case 2:
        this._filter = Filter.InvalidKeys;
        return;
      case 3:
        this._filter = Filter.InvalidDE;
        return;
      case 4:
        this._filter = Filter.InvalidEN;
        return;
      case 5:
        this._filter = Filter.InvalidES;
        return;
      case 6:
        this._filter = Filter.InvalidFr;
        return;
      case 7:
        this._filter = Filter.InvalidIt;
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    public languageLoaderService: LanguageLoaderService,
    public modalOrganizerService: ModalOrganizerService,
    public projectLoaderService: ProjectLoaderService,
    public userService: UserService,
  ) {
    this.headerLabelService.headerLabel = 'I18Nator';
    this.footerBarService.replaceFooterElements([]);
  }

  public ngOnInit(): void {
    this.setProject(Project.Frontend);

    if (isPlatformBrowser(this.platformId)) {
      const contentContainer = document.getElementById('content-container');

      if (contentContainer) {
        contentContainer.classList.remove('container');
        contentContainer.classList.add('container-fluid');
      }
    }
  }

  public ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const contentContainer = document.getElementById('content-container');

      if (contentContainer) {
        contentContainer.classList.add('container');
        contentContainer.classList.remove('container-fluid');
      }
    }
  }

  public updateData(): void {
    this.languageLoaderService.updateProject();
  }

  public changeFilter(filter: number): void {
    this.filter = filter;
    this._selectedKey = null;
  }

  public setProject(value: Project): void {
    this._selectedKey = null;
    this.languageLoaderService.reset();
    this.projectLoaderService.currentProject = value;

    this.reloadLanguageData();
  }

  public dataChanged(index: number): void {
    this._selectedKey = this.languageLoaderService.parsedLangData[index];
  }

  public getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

  public updateKey(event, langRef, key): void {
    const value = event.target.value;

    this.languageLoaderService.changedData = true;

    if (!value.length) {
      delete key.value[langRef];

    } else {
      key.value[langRef] = value;

    }

  }

  public isUnusedKey(): boolean {
    return !!this.languageLoaderService.unusedKeys.find(unusedKey => unusedKey === this._selectedKey.key);
  }

  private reloadLanguageData(): void {
    this.languageLoaderService.getLangData();
  }
}
