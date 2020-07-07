import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageKey } from '../../../lib/enums/enums';
import { IAvailableNicks } from '../../../lib/interfaces/IAvailableNicks';
import { NickApiService } from '../../../service/api/nick/nick-api.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-nickname-manager',
  templateUrl: './nickname-manager.component.html',
  styleUrls: ['./nickname-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NicknameManagerComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'NicknameManagerComponent';

  private _availableNicks: IAvailableNicks;
  private _selectedCategory = '';
  private _availableNicksBackup: IAvailableNicks;
  private _previousSearchValue = '';
  private readonly _destroy = new Subject();

  public readonly throttle = 0;
  public readonly scrollDistance = 4;
  public visibleData = 20;

  get availableNicks(): IAvailableNicks {
    return this._availableNicks;
  }

  set availableNicks(value: IAvailableNicks) {
    this._availableNicks = value;
    if (this._availableNicks.emojis) {
      this._availableNicks.emojis = this._availableNicks.emojis.map(
        nick => this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(nick)));
    }
    this._availableNicksBackup = Object.assign({}, value);
    this.cd.markForCheck();
  }

  get selectedCategory(): string {
    return this._selectedCategory;
  }

  set selectedCategory(value: string) {
    this._selectedCategory = value;
    this.visibleData = 20;
  }

  constructor(
    public quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
    private footerBarService: FooterBarService,
    private nickApiService: NickApiService,
    private customMarkdownService: CustomMarkdownService,
    private cd: ChangeDetectorRef,
  ) {

    this.footerBarService.TYPE_REFERENCE = NicknameManagerComponent.TYPE;
    const footerElements = [this.footerBarService.footerElemBack, this.footerBarService.footerElemBlockRudeNicknames];
    this.footerBarService.replaceFooterElements(footerElements);

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName)).then(() => this.cd.markForCheck());
  }

  public onScrollDown(): void {
    this.visibleData += 20;
    this.cd.markForCheck();
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
    // bypassSecurityTrustHtml is required because the img tag of the emoji must be rendered
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  public availableNickCategories(): Array<string> {
    return Object.keys(this.availableNicks || {});
  }

  public toggleSelectedCategory(name: string): void {
    if (!this.getNumberOfAvailableNicksForCategory(name)) {
      return;
    }

    this.selectedCategory = this.selectedCategory === name ? '' : name;
  }

  public selectNick(name: any): void {
    if (this.selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    this.quizService.toggleSelectedNick(name.toString());
  }

  public parseAvailableNick(name: any): string {
    if (this.selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    return name.match(/:[\w\+\-]+:/g) ? this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(name)) : name;
  }

  public hasSelectedNick(name: any): boolean {
    if (this.selectedCategory === 'emojis') {
      name = name.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
    }
    return this.quizService.quiz.sessionConfig.nicks.selectedNicks.indexOf(name) !== -1;
  }

  public hasSelectedCategory(category?: string): boolean {
    return category ? category === this.selectedCategory : !!this.selectedCategory;
  }

  public hasSelectedAllNicks(): boolean {
    const selectedNicks = this.quizService.quiz.sessionConfig.nicks.selectedNicks;
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
    if (!this.availableNicks[category] || !this.quizService.quiz) {
      return 0;
    }

    const selectedNicks = this.quizService.quiz.sessionConfig.nicks.selectedNicks;
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
        this.quizService.removeSelectedNickByName(elem.toString());
      });
    } else {
      this.availableNicks[this.selectedCategory].forEach(elem => {
        if (this.selectedCategory === 'emojis') {
          elem = elem.changingThisBreaksApplicationSecurity.match(/:[\w\+\-]+:/g)[0];
        }
        this.quizService.addSelectedNick(elem.toString());
      });
    }
  }

  public ngOnInit(): void {
    this.nickApiService.getPredefinedNicks().pipe(takeUntil(this._destroy)).subscribe(data => {
      this.availableNicks = data;
    }, error => {
      console.log('NicknameManagerComponent: GetPredefinedNicks failed', error);
    });
  }

  public ngOnDestroy(): void {
    this.quizService.persist();
    this._destroy.next();
    this._destroy.complete();
  }

  public getCategoryTranslation(cat: string): string {
    switch (cat) {
      case 'disney':
        return 'component.nickname_categories.category.disney';
      case 'science':
        return 'component.nickname_categories.category.science';
      case 'fantasy':
        return 'component.nickname_categories.category.fantasy';
      case 'literature':
        return 'component.nickname_categories.category.literature';
      case 'mythology':
        return 'component.nickname_categories.category.mythology';
      case 'actor':
        return 'component.nickname_categories.category.actor';
      case 'politics':
        return 'component.nickname_categories.category.politics';
      case 'turing_award':
        return 'component.nickname_categories.category.turing_award';
      case 'emojis':
        return 'component.nickname_categories.category.emojis';
    }
  }

  public getParsedSelectedNicks(): Array<SafeHtml> {
    return this.quizService.quiz?.sessionConfig.nicks.selectedNicks
      .map(v => this.customMarkdownService.parseGithubFlavoredMarkdown(v))
      .map(v => this.sanitizeHTML(v))
      ;
  }
}
