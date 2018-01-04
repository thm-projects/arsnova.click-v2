import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {DefaultSettings} from '../../../../lib/default.settings';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {IAvailableNicks} from 'arsnova-click-v2-types/src/common';

@Component({
  selector: 'app-nickname-manager',
  templateUrl: './nickname-manager.component.html',
  styleUrls: ['./nickname-manager.component.scss']
})
export class NicknameManagerComponent implements OnInit, OnDestroy {
  get selectedCategory(): string {
    return this._selectedCategory;
  }

  set availableNicks(value: IAvailableNicks) {
    this._availableNicks = value;
    this._availableNicks.emojis = this._availableNicks.emojis.map(nick => this.sanitizeHTML(parseGithubFlavoredMarkdown(nick)));
    this._availableNicksBackup = Object.assign({}, value);
  }
  get availableNicks() {
    return this._availableNicks;
  }

  private _availableNicks: IAvailableNicks;
  private _availableNicksBackup: IAvailableNicks;
  private _selectedCategory = '';
  private _previousSearchValue = '';

  constructor(
    private sanitizer: DomSanitizer,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private footerBarService: FooterBarService,
    private http: HttpClient) {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemBlockRudeNicknames,
      this.footerBarService.footerElemEnableCasLogin
    ]);
  }

  filterForKeyword(event: Event): void {
    const searchValue = (<HTMLInputElement>event.target).value;

    if (searchValue.length < this._previousSearchValue.length) {
      this._availableNicks = Object.assign({}, this._availableNicksBackup);
    }

    this._previousSearchValue = searchValue;

    if (!searchValue.length) {
      return;
    }

    Object.keys(this._availableNicks).forEach(category => {
      this._availableNicks[category] = this._availableNicks[category].filter(baseNick => {
        return baseNick.toString().toLowerCase().indexOf(searchValue) > -1;
      });
    });
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  parseAvailableNick(name: string): SafeHtml {
    return name;
  }

  availableNickCategories(): Array<string> {
    return Object.keys(this._availableNicks || {});
  }

  toggleSelectedCategory(name: string): void {
    if (!this.getNumberOfAvailableNicksForCategory(name)) {
      return;
    }

    this._selectedCategory = this._selectedCategory === name ? '' : name;
  }

  selectNick(name: any): void {
    if (this._selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.toggleSelectedNick(name.toString());
  }

  hasSelectedNick(name: any): boolean {
    if (this._selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    return this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.hasSelectedNick(name.toString());
  }

  hasSelectedCategory(category?: string): boolean {
    return category ? category === this._selectedCategory : !!this._selectedCategory;
  }

  hasSelectedAllNicks(): boolean {
    const selectedNicks = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.selectedNicks;
    const filteredNicksLength = this._availableNicks[this._selectedCategory].filter(elem => {
      if (this._selectedCategory === 'emojis') {
        const emojiMatch = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g);
        return selectedNicks.indexOf(emojiMatch ? emojiMatch[0] : null) > -1;
      } else {
        return selectedNicks.indexOf(elem) > -1;
      }
    }).length;
    return filteredNicksLength === this._availableNicks[this._selectedCategory].length;
  }

  getNumberOfSelectedNicksOfCategory(category: string): number {
    const selectedNicks = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.selectedNicks;
    return this._availableNicks[category].filter(elem => {
      return selectedNicks.indexOf(elem) > -1;
    }).length;
  }

  getNumberOfAvailableNicksForCategory(category: string): number {
    return this._availableNicks[category].length;
  }

  toggleAllNicks(): void {
    if (this.hasSelectedAllNicks()) {
      this._availableNicks[this._selectedCategory].forEach(elem => {
        if (this._selectedCategory === 'emojis') {
          elem = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
        }
        this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.removeSelectedNickByName(elem.toString());
      });
    } else {
      this._availableNicks[this._selectedCategory].forEach(elem => {
        if (this._selectedCategory === 'emojis') {
          elem = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
        }
        this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.addSelectedNick(elem.toString());
      });
    }
  }

  ngOnInit() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get(`${DefaultSettings.httpApiEndpoint}/nicks/predefined`, {headers})
        .subscribe(
          (data: IAvailableNicks) => {
            this.availableNicks = data;
          },
          error => {
            console.log(error);
          }
        );
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
  }

}
