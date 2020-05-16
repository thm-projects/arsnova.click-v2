import { MemberEntity } from '../../lib/entities/member/MemberEntity';
import { IMemberSerialized } from '../../lib/interfaces/entities/Member/IMemberSerialized';

export class AttendeeMockService {
  public attendees = [];

  public getMemberGroups(): Array<string> {
    return ['Default'];
  }

  public getOwnNick(): Promise<string> {
    return new Promise(resolve => resolve('testNickname'));
  }

  public addMember(attendee: IMemberSerialized): void {
    attendee.name = 'testNickname';
    this.attendees.push(attendee);
  }

  public reloadData(): void {}

  public cleanUp(): void {
    this.attendees = [];
  }

  public hasConfidenceValue(): boolean {
    return false;
  }

  public getConfidenceValue(): number {
    return 10;
  }

  public hasReadingConfirmation(): boolean {
    return false;
  }

  public hasReponse(): boolean {
    return false;
  }

  public getActiveMembers(): Array<MemberEntity> {
    return [];
  }
}
