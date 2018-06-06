import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IAvailableNicks } from 'arsnova-click-v2-types/src/common';
import { DefaultSettings } from '../../../../lib/default.settings';
import { parseGithubFlavoredMarkdown } from '../../../../lib/markdown/markdown';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';

@Component({
  selector: 'app-nickname-manager',
  templateUrl: './nickname-manager.component.html',
  styleUrls: ['./nickname-manager.component.scss'],
})
export class NicknameManagerComponent implements OnInit, OnDestroy {
  public static TYPE = 'NicknameManagerComponent';

  private _availableNicks: IAvailableNicks;

  get availableNicks(): IAvailableNicks {
    return this._availableNicks;
  }

  set availableNicks(value: IAvailableNicks) {
    this._availableNicks = value;
    if (this._availableNicks.emojis) {
      this._availableNicks.emojis = this._availableNicks.emojis.map(nick => this.sanitizeHTML(parseGithubFlavoredMarkdown(nick)));
    }
    this._availableNicksBackup = Object.assign({}, value);
  }

  private _selectedCategory = '';

  get selectedCategory(): string {
    return this._selectedCategory;
  }

  private _availableNicksBackup: IAvailableNicks;
  private _previousSearchValue = '';

  constructor(
    private sanitizer: DomSanitizer,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private footerBarService: FooterBarService,
    private http: HttpClient,
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameManagerComponent.TYPE;
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemBlockRudeNicknames,
      this.footerBarService.footerElemEnableCasLogin,
    ]);
  }

  public filterForKeyword(event: Event): void {
    const searchValue = (<HTMLInputElement>event.target).value.toString().toLowerCase();

    if (searchValue.length < this._previousSearchValue.length) {
      this._availableNicks = Object.assign({}, this._availableNicksBackup);
    }

    this._previousSearchValue = searchValue;

    if (!searchValue.length) {
      return;
    }

    Object.keys(this.availableNicks).forEach(category => {
      this.availableNicks[category] = this.availableNicks[category].filter(baseNick => {
        return baseNick.toString().toLowerCase().indexOf(searchValue) > -1;
      });
    });
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public availableNickCategories(): Array<string> {
    return Object.keys(this.availableNicks || {});
  }

  public toggleSelectedCategory(name: string): void {
    if (!this.getNumberOfAvailableNicksForCategory(name)) {
      return;
    }

    this._selectedCategory = this.selectedCategory === name ? '' : name;
  }

  public selectNick(name: any): void {
    if (this.selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.toggleSelectedNick(name.toString());
  }

  public parseAvailableNick(name: string): SafeHtml {
    return name.match(/:[\w\+\-]+:/g) ? this.sanitizeHTML(parseGithubFlavoredMarkdown(name)) : name;
  }

  public hasSelectedNick(name: any): boolean {
    if (this.selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    return this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.hasSelectedNick(name.toString());
  }

  public hasSelectedCategory(category?: string): boolean {
    return category ? category === this.selectedCategory : !!this.selectedCategory;
  }

  public hasSelectedAllNicks(): boolean {
    const selectedNicks = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.selectedNicks;
    const filteredNicksLength = this.availableNicks[this.selectedCategory].filter(elem => {
      if (this.selectedCategory === 'emojis') {
        const emojiMatch = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g);
        return selectedNicks.indexOf(emojiMatch ? emojiMatch[0] : null) > -1;
      } else {
        return selectedNicks.indexOf(elem) > -1;
      }
    }).length;
    return filteredNicksLength === this.availableNicks[this.selectedCategory].length;
  }

  public getNumberOfSelectedNicksOfCategory(category: string): number {
    if (!this.availableNicks[category]) {
      return 0;
    }

    const selectedNicks = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.selectedNicks;
    return this.availableNicks[category].filter(elem => {
      return selectedNicks.indexOf(elem) > -1;
    }).length;
  }

  public getNumberOfAvailableNicksForCategory(category: string): number {
    if (!this.availableNicks[category]) {
      return 0;
    }

    return this.availableNicks[category].length;
  }

  public toggleAllNicks(): void {
    if (this.hasSelectedAllNicks()) {
      this.availableNicks[this.selectedCategory].forEach(elem => {
        if (this.selectedCategory === 'emojis') {
          elem = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
        }
        this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.removeSelectedNickByName(elem.toString());
      });
    } else {
      this.availableNicks[this.selectedCategory].forEach(elem => {
        if (this.selectedCategory === 'emojis') {
          elem = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
        }
        this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.addSelectedNick(elem.toString());
      });
    }
  }

  public ngOnInit(): void {
    this.http.get<IAvailableNicks>(`${DefaultSettings.httpApiEndpoint}/nicks/predefined`).subscribe(
      data => {
        this.availableNicks = data;
      },
      error => {
        console.log(error);
      },
    );
  }

  public ngOnDestroy(): void {
    this.activeQuestionGroupService.persist();
  }

}
