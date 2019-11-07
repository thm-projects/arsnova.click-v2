import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageKey } from '../../../lib/enums/enums';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-member-group-manager',
  templateUrl: './member-group-manager.component.html',
  styleUrls: ['./member-group-manager.component.scss'],
})
export class MemberGroupManagerComponent implements OnInit, OnDestroy {
  public static TYPE = 'MemberGroupManagerComponent';
  public memberGroupName = '';

  private _memberGroups: Array<string> = [];

  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  private _maxMembersPerGroup: number;

  get maxMembersPerGroup(): number {
    return this._maxMembersPerGroup;
  }

  set maxMembersPerGroup(value: number) {
    this._maxMembersPerGroup = value;
  }

  private _autoJoinToGroup: boolean;

  get autoJoinToGroup(): boolean {
    return this._autoJoinToGroup;
  }

  set autoJoinToGroup(value: boolean) {
    this._autoJoinToGroup = value;
  }

  private readonly _destroy = new Subject();

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
    private quizService: QuizService,
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupManagerComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._memberGroups = this.quizService.quiz.sessionConfig.nicks.memberGroups;
      this._maxMembersPerGroup = this.quizService.quiz.sessionConfig.nicks.maxMembersPerGroup;
      this._autoJoinToGroup = this.quizService.quiz.sessionConfig.nicks.autoJoinToGroup;
    });
  }

  public ngOnDestroy(): void {
    this.quizService.quiz.sessionConfig.nicks.memberGroups = this.memberGroups;
    this.quizService.quiz.sessionConfig.nicks.maxMembersPerGroup = this.maxMembersPerGroup;
    this.quizService.quiz.sessionConfig.nicks.autoJoinToGroup = this.autoJoinToGroup;

    this.quizService.persist();

    this._destroy.next();
    this._destroy.complete();
  }

  public addMemberGroup(): void {
    if (!this.memberGroupName.length || this.memberGroups.find(group => group === this.memberGroupName)) {
      return;
    }

    this.memberGroups.push(this.memberGroupName);
    this.memberGroupName = '';
  }

  public removeMemberGroup(groupName: string): void {
    if (!this.memberGroups.find(group => group === groupName)) {
      return;
    }

    this.memberGroups.splice(this.memberGroups.findIndex(group => group === groupName), 1);
  }

}
