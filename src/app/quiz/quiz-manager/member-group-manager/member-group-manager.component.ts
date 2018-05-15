import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {HeaderLabelService} from '../../../service/header-label.service';
import {FooterBarService} from '../../../service/footer-bar.service';

@Component({
  selector: 'app-member-group-manager',
  templateUrl: './member-group-manager.component.html',
  styleUrls: ['./member-group-manager.component.scss']
})
export class MemberGroupManagerComponent implements OnInit, OnDestroy {
  public static TYPE = 'MemberGroupManagerComponent';

  set maxMembersPerGroup(value: number) {
    this._maxMembersPerGroup = value;
  }
  get maxMembersPerGroup(): number {
    return this._maxMembersPerGroup;
  }
  get autoJoinToGroup(): boolean {
    return this._autoJoinToGroup;
  }
  set autoJoinToGroup(value: boolean) {
    this._autoJoinToGroup = value;
  }
  get memberGroups(): Array<string> {
    return this._memberGroups;
  }

  private _memberGroups: Array<string> = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.memberGroups;
  private _maxMembersPerGroup: number = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.maxMembersPerGroup;
  private _autoJoinToGroup: boolean = this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.autoJoinToGroup;
  public memberGroupName = '';

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
    private activeQuestionGroupService: ActiveQuestionGroupService
  ) {

    this.footerBarService.TYPE_REFERENCE = MemberGroupManagerComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack
    ]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.memberGroups = this.memberGroups;
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.maxMembersPerGroup = this.maxMembersPerGroup;
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.autoJoinToGroup = this.autoJoinToGroup;

    this.activeQuestionGroupService.persist();
  }

  public addMemberGroup () {
    if (this.memberGroups.indexOf(this.memberGroupName) > -1 || !this.memberGroupName.length) {
      return;
    }

    this.memberGroups.push(this.memberGroupName);
    this.memberGroupName = '';
  }

  public removeMemberGroup(groupName: string) {
    this.memberGroups.splice(this.memberGroups.indexOf(groupName), 1);
  }

}
