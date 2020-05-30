import { Observable, ReplaySubject } from 'rxjs';
import { MemberEntity } from '../../lib/entities/member/MemberEntity';
import { IMemberSerialized } from '../../lib/interfaces/entities/Member/IMemberSerialized';

export class AttendeeMockService {
  public attendees = [];
  public attendeeAmount = new ReplaySubject(1);

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

  public cleanUp(): Observable<any> {
    this.attendees = [];
    return new Observable(subscriber => subscriber.next());
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
