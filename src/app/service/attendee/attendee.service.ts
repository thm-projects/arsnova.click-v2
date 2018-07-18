import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { INickname } from 'arsnova-click-v2-types/src/common';
import { Attendee } from '../../../lib/attendee/attendee';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AttendeeService implements OnDestroy {
  private _attendees: Array<INickname> = [];

  get attendees(): Array<INickname> {
    return this._attendees;
  }

  set attendees(value: Array<INickname>) {
    this._attendees = value;
  }

  private _ownNick: string;

  set ownNick(value: string) {
    this._ownNick = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
    private storageService: StorageService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  public getMemberGroups(): Array<string> {
    if (!this.currentQuizService.quiz) {
      return [];
    }

    return this.currentQuizService.quiz.sessionConfig.nicks.memberGroups;
  }

  public getMembersOfGroup(groupName: string): Array<INickname> {
    return this._attendees.filter(attendee => attendee.groupName === groupName);
  }

  public cleanUp(): void {
    this.attendees = [];
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.delete(DB_TABLE.CONFIG, STORAGE_KEY.ATTENDEES).subscribe();
    }
  }

  public addMember(attendee: INickname): void {
    if (!this.getMember(attendee.name)) {
      this._attendees.push(new Attendee(attendee));
      this.persistToSessionStorage();
    }
  }

  public removeMember(name: string): void {
    const member = this.getMember(name);
    if (member) {
      this._attendees.splice(this._attendees.indexOf(member), 1);
      this.persistToSessionStorage();
    }
  }

  public clearResponses(): void {
    this._attendees.forEach((attendee) => {
      attendee.responses.splice(0, attendee.responses.length);
    });
    this.persistToSessionStorage();
  }

  public isOwnNick(name: string): boolean {
    return name === this._ownNick;
  }

  public getOwnNick(): string {
    return this._ownNick;
  }

  public modifyResponse(attendee: INickname): void {
    const member = this.getMember(attendee.name);
    if (!member) {
      return;
    }
    this.getMember(attendee.name).responses = attendee.responses;
    this.persistToSessionStorage();
  }

  public ngOnDestroy(): void {
    this.persistToSessionStorage();
  }

  private async loadData(): Promise<void> {
    const restoreAttendees = await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.ATTENDEES).toPromise();
    if (restoreAttendees && restoreAttendees.length) {
      this._attendees = restoreAttendees.map((attendee) => {
        return new Attendee(attendee);
      });
      if (this._attendees.length) {
        this.footerBarService.footerElemStartQuiz.isActive = true;
        this._ownNick = await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.NICK).toPromise();
      }
    }
  }

  private getMember(nickname: string): INickname {
    return this._attendees.filter(value => value.name === nickname)[0];
  }

  private persistToSessionStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.ATTENDEES, this._attendees.map(value => value.serialize())).subscribe();
    }
  }

}
