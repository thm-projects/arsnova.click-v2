import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { StorageKey } from '../../../lib/enums/enums';
import { IMemberGroupBase } from '../../../lib/interfaces/users/IMemberGroupBase';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

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
  private readonly _destroy = new Subject();

  public memberGroupName = '';
  public readonly groupColors: Array<string> = [
    '#ff0000', '#008000', '#800080', '#add8e6', '#ffa500', '#ffc0cb', '#5f9ea0', '#fff8dc', '#7fffd4', '#bf0202', '#025abf', '#e6dd26'
  ];

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
    private customMarkdownService: CustomMarkdownService
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

  public addMemberGroup(): void {
    if (!this.memberGroupName.length || this.memberGroupExists()) {
      return;
    }

    let random: number;
    do {
      random = Math.floor(Math.random() * this.groupColors.length);
    } while (this.hasGroupColorSelected(this.groupColors[random]));
    this.memberGroups.push({name: this.memberGroupName.trim(), color: this.groupColors[random]});
    this.memberGroupName = '';
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
    if (value.match(/:[\w\+\-]+:/g)) {
      return this.sanitizeHTML(this.customMarkdownService.parseGithubFlavoredMarkdown(value));
    }
    return value;
  }

  public memberGroupExists(): boolean {
    return this.memberGroups.findIndex(value => value.name?.toLowerCase().trim() === this.memberGroupName.toLowerCase().trim()) > -1;
  }

  public hasGroupColorSelected(color: string): boolean {
    return Boolean(this.memberGroups.find(value => value.color === color));
  }
}
