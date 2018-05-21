import { INickname } from 'arsnova-click-v2-types/src/common';
import { AttendeeService } from './attendee.service';

export class AttendeeMockService extends AttendeeService {
  public attendees = [];

  public getMemberGroups(): Array<string> {
    return ['Default'];
  }

  public getOwnNick(): string {
    return 'testNickname';
  }

  public addMember(attendee: INickname): void {
    attendee.name = 'testNickname';
    super.addMember(attendee);
  }
}
