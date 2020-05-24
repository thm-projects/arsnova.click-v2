import { DefaultSettings } from '../../default.settings';
import { IMemberGroupBase } from '../../interfaces/users/IMemberGroupBase';

export class NickSessionConfigurationEntity {
  public memberGroups: Array<IMemberGroupBase> = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.memberGroups;
  public maxMembersPerGroup: number = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.maxMembersPerGroup;
  public autoJoinToGroup: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.autoJoinToGroup;
  public selectedNicks: Array<string> = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.selectedNicks;
  public blockIllegalNicks: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.blockIllegalNicks;
  public restrictToCasLogin: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.nicks.restrictToCasLogin;

  constructor(props) {
    this.memberGroups = props.memberGroups;
    this.maxMembersPerGroup = props.maxMembersPerGroup;
    this.autoJoinToGroup = props.autoJoinToGroup;
    this.selectedNicks = props.selectedNicks;
    this.blockIllegalNicks = props.blockIllegalNicks;
    this.restrictToCasLogin = props.restrictToCasLogin;
  }

  public equals(value: NickSessionConfigurationEntity): boolean {
    return this.memberGroups === value.memberGroups && //
           this.maxMembersPerGroup === value.maxMembersPerGroup && //
           this.autoJoinToGroup === value.autoJoinToGroup && //
           this.selectedNicks === value.selectedNicks && //
           this.blockIllegalNicks === value.blockIllegalNicks && //
           this.restrictToCasLogin === value.restrictToCasLogin;
  }

  public hasSelectedNick(nickname: string): boolean {
    return this.selectedNicks.indexOf(nickname) !== -1;
  }

  public toggleSelectedNick(nickname: string): void {
    if (this.hasSelectedNick(nickname)) {
      this.removeSelectedNickByName(nickname);
    } else {
      this.addSelectedNick(nickname);
    }
  }

  public addSelectedNick(newSelectedNick: string): void {
    if (this.hasSelectedNick(newSelectedNick)) {
      return;
    }
    this.selectedNicks.push(newSelectedNick);
  }

  public removeSelectedNickByName(selectedNick: string): void {
    const index = this.selectedNicks.indexOf(selectedNick);
    if (index === -1) {
      return;
    }
    this.selectedNicks.splice(index, 1);
  }
}
