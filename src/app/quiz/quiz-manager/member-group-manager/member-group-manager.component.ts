import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { StorageKey } from '../../../lib/enums/enums';
import { IMemberGroupBase } from '../../../lib/interfaces/users/IMemberGroupBase';
import { NickApiService } from '../../../service/api/nick/nick-api.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

interface IMemberGroupInput {
  html: string;
  raw: string;
}

@Component({
  selector: 'app-member-group-manager',
  templateUrl: './member-group-manager.component.html',
  styleUrls: ['./member-group-manager.component.scss'],
})
export class MemberGroupManagerComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'MemberGroupManagerComponent';

  private _memberGroups: Array<IMemberGroupBase> = [];
  private _maxMembersPerGroup: number;
  private _autoJoinToGroup: boolean;
  private availableEmojis: Array<string> = [];
  private readonly _destroy = new Subject();

  public readonly groupColors: Array<string> = [
    '#ff0000', '#008000', '#800080', '#add8e6', '#ffa500', '#ffc0cb', '#5f9ea0', '#fff8dc', '#7fffd4', '#bf0202', '#025abf', '#e6dd26',
  ];
  public readonly formGroup = this.formBuilder.group({
    memberGroupName: new FormControl(null, { validators: [Validators.required, this.hasValidGroupSelected.bind(this)], updateOn: 'change' }),
  });
  @ViewChild('instance', { static: true }) public instance: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public readonly self = this;

  get memberGroups(): Array<IMemberGroupBase> {
    return this._memberGroups;
  }

  get maxMembersPerGroup(): number {
    return this._maxMembersPerGroup;
  }

  set maxMembersPerGroup(value: number) {
    this._maxMembersPerGroup = value;
  }

  get autoJoinToGroup(): boolean {
    return this._autoJoinToGroup;
  }

  set autoJoinToGroup(value: boolean) {
    this._autoJoinToGroup = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private customMarkdownService: CustomMarkdownService,
    private formBuilder: FormBuilder,
    private nickApiService: NickApiService,
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupManagerComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);

    if (isPlatformBrowser(this.platformId)) {
      this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
    }
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(filter(quiz => !!quiz), takeUntil(this._destroy)).subscribe(quiz => {
      this._memberGroups = this.quizService.quiz?.sessionConfig.nicks.memberGroups;
      this._maxMembersPerGroup = this.quizService.quiz?.sessionConfig.nicks.maxMembersPerGroup;
      this._autoJoinToGroup = this.quizService.quiz?.sessionConfig.nicks.autoJoinToGroup;
    });

    this.nickApiService.getPredefinedNicks().pipe(takeUntil(this._destroy)).subscribe(data => {
      this.availableEmojis = data.emojis;
    }, error => {
      console.log('NicknameManagerComponent: GetPredefinedNicks failed', error);
    });
  }

  public ngOnDestroy(): void {
    if (this.quizService.quiz) {
      this.quizService.quiz.sessionConfig.nicks.memberGroups = this.memberGroups;
      this.quizService.quiz.sessionConfig.nicks.maxMembersPerGroup = this.maxMembersPerGroup;
      this.quizService.quiz.sessionConfig.nicks.autoJoinToGroup = this.autoJoinToGroup;

      this.quizService.persist();
    }

    this._destroy.next();
    this._destroy.complete();
  }

  public inputFormatter(groupName: IMemberGroupInput): string {
    return `${groupName.raw}`;
  }

  public search(text$: Observable<string>): Observable<Array<IMemberGroupInput>> {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map(term => {
      if (!term.length) {
        return [];
      }

      return this.availableEmojis.filter(emoji => emoji.startsWith(term)).slice(0, 10).map(value => ({
        html: this.parseNickname(value),
        raw: value,
      }));
    }));
  }

  public addMemberGroup(): void {
    if (!this.formGroup.get('memberGroupName').value || this.memberGroups.length === this.groupColors.length) {
      return;
    }

    let random: number;
    do {
      random = Math.floor(Math.random() * this.groupColors.length);
    } while (this.hasGroupColorSelected(this.groupColors[random]));

    let match: string;
    if (this.formGroup.get('memberGroupName').value.raw) {
      match = this.formGroup.get('memberGroupName').value.raw;
    } else {
      match = this.formGroup.get('memberGroupName').value;
    }

    this.memberGroups.push({ name: match.trim(), color: this.groupColors[random] });
    this.formGroup.get('memberGroupName').reset();
  }

  public removeMemberGroup(groupName: string): void {
    if (!this.memberGroups.find(group => group.name === groupName)) {
      return;
    }

    this.memberGroups.splice(this.memberGroups.findIndex(group => group.name === groupName), 1);
  }

  public sanitizeHTML(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  public parseNickname(value: string): string {
    if (value?.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  public hasGroupColorSelected(color: string): boolean {
    return Boolean(this.memberGroups.find(value => value.color === color));
  }

  private memberGroupExists(): boolean {
    let match: string;
    if (this.formGroup.get('memberGroupName').value.raw) {
      match = this.formGroup.get('memberGroupName').value.raw;
    } else {
      match = this.formGroup.get('memberGroupName').value;
    }

    return this.memberGroups.findIndex(value => {
      return value.name?.toLowerCase().trim() === match.toLowerCase().trim();
    }) > -1;
  }

  private hasValidGroupSelected(control: AbstractControl): ValidationErrors {
    if (control.pristine) {
      return {};
    }

    if (this.memberGroups.length === this.groupColors.length) {
      return { full: true };
    }

    if (this.memberGroupExists()) {
      return { duplicate: true };
    }

    let emojiMatch;
    if (control.value?.raw) {
      emojiMatch = control.value.raw.match(/:[\w\+\-]+:/);
    } else {
      emojiMatch = control.value?.match(/:[\w\+\-]+:/);
    }

    if (emojiMatch && emojiMatch[0] !== emojiMatch.input) {
      return { invalid: true };
    }

    return null;
  }
}
