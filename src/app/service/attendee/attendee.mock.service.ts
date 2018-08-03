import { INickname } from 'arsnova-click-v2-types/dist/common';

export class AttendeeMockService {
  public attendees = [];

  public getMemberGroups(): Array<string> {
    return ['Default'];
  }

  public getOwnNick(): Promise<string> {
    return new Promise(resolve => resolve('testNickname'));
  }

  public addMember(attendee: INickname): void {
    attendee.name = 'testNickname';
    this.attendees.push(attendee);
  }

  public cleanUp(): void {
    this.attendees = [];
  }
}
