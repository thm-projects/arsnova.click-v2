import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';

@Component({
  selector: 'app-member-group-manager',
  templateUrl: './member-group-manager.component.html',
  styleUrls: ['./member-group-manager.component.scss'],
})
export class MemberGroupManagerComponent implements OnDestroy {
  public static TYPE = 'MemberGroupManagerComponent';
  public memberGroupName = '';

  private _memberGroups: Array<string> = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.memberGroups;

  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  private _maxMembersPerGroup: number = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.maxMembersPerGroup;

  get maxMembersPerGroup(): number {
    return this._maxMembersPerGroup;
  }

  set maxMembersPerGroup(value: number) {
    this._maxMembersPerGroup = value;
  }

  private _autoJoinToGroup: boolean = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.autoJoinToGroup;

  get autoJoinToGroup(): boolean {
    return this._autoJoinToGroup;
  }

  set autoJoinToGroup(value: boolean) {
    this._autoJoinToGroup = value;
  }

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupManagerComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);
  }

  public ngOnDestroy(): void {
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.memberGroups = this.memberGroups;
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.maxMembersPerGroup = this.maxMembersPerGroup;
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.autoJoinToGroup = this.autoJoinToGroup;

    this.activeQuestionGroupService.persist();
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
