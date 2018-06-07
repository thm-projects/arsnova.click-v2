import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { INickname } from 'arsnova-click-v2-types/src/common';
import { Attendee } from '../../../lib/attendee/attendee';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';

@Injectable()
export class AttendeeService implements OnDestroy {
  private _attendees: Array<INickname> = [];

  get attendees(): Array<INickname> {
    return this._attendees;
  }

  set attendees(value: Array<INickname>) {
    this._attendees = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const restoreAttendees = window.sessionStorage.getItem('config.attendees');
      if (restoreAttendees) {
        this._attendees = JSON.parse(restoreAttendees).map((attendee) => {
          return new Attendee(attendee);
        });
        if (this._attendees.length) {
          this.footerBarService.footerElemStartQuiz.isActive = true;
        }
      }
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
      window.sessionStorage.removeItem('config.attendees');
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
    if (isPlatformBrowser(this.platformId)) {
      return name === window.sessionStorage.getItem(`config.nick`);
    }
  }

  public getOwnNick(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(`config.nick`);
    }
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

  private getMember(nickname: string): INickname {
    return this._attendees.filter(value => value.name === nickname)[0];
  }

  private persistToSessionStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('config.attendees', JSON.stringify(this._attendees.map(value => value.serialize())));
    }
  }

}
