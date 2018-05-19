import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {FooterBarService} from './footer-bar.service';
import {INickname, INicknameSerialized, IQuizResponse} from 'arsnova-click-v2-types/src/common';
import {CurrentQuizService} from './current-quiz.service';
import {isPlatformBrowser} from '@angular/common';

class Player implements INickname {
  get groupName(): string {
    return this._groupName;
  }

  set responses(value: Array<IQuizResponse>) {
    this._responses = value;
  }

  get responses(): Array<IQuizResponse> {
    return this._responses;
  }

  get colorCode(): string {
    return this._colorCode;
  }

  get name(): string {
    return this._name;
  }

  get id(): number {
    return this._id;
  }

  private readonly _id: number;
  private readonly _name: string;
  private readonly _groupName: string;
  private readonly _colorCode: string;
  private _responses: Array<IQuizResponse>;
  public webSocket;
  public webSocketAuthorization;
  public casProfile;

  constructor({id, name, groupName, colorCode, responses}: INickname) {
    this._id = id;
    this._name = name;
    this._groupName = groupName;
    this._colorCode = colorCode;
    this._responses = responses || [];
  }

  serialize(): INicknameSerialized {
    return {
      id: this.id,
      name: this.name,
      groupName: this.groupName,
      colorCode: this.colorCode,
      responses: this.responses
    };
  }
}

@Injectable()
export class AttendeeService implements OnDestroy {
  get attendees(): Array<INickname> {
    return this._attendees;
  }

  set attendees(value: Array<INickname>) {
    this._attendees = value;
  }

  private _attendees: Array<INickname> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const restoreAttendees = window.sessionStorage.getItem('config.attendees');
      if (restoreAttendees) {
        this._attendees = JSON.parse(restoreAttendees).map((attendee) => {
          return new Player(attendee);
        });
        if (this._attendees.length) {
          this.footerBarService.footerElemStartQuiz.isActive = true;
        }
      }
    }
  }

  public getMemberGroups(): Array<string> {
    return this.currentQuizService.quiz.sessionConfig.nicks.memberGroups;
  }

  public getMembersOfGroup(groupName: string): Array<INickname> {
    return this._attendees.filter(attendee => attendee.groupName === groupName);
  }

  cleanUp(): void {
    this.attendees = [];
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('config.attendees');
    }
  }

  addMember(attendee: INickname): void {
    if (!this.getMember(attendee.name)) {
      this._attendees.push(new Player(attendee));
      this.persistToSessionStorage();
    }
  }

  removeMember(name: string): void {
    const member = this.getMember(name);
    if (member) {
      this._attendees.splice(this._attendees.indexOf(member), 1);
      this.persistToSessionStorage();
    }
  }

  clearResponses(): void {
    this._attendees.forEach((attendee) => {
      attendee.responses.splice(0, attendee.responses.length);
    });
    this.persistToSessionStorage();
  }

  isOwnNick(name: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return name === window.sessionStorage.getItem(`config.nick`);
    }
  }

  getOwnNick(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(`config.nick`);
    }
  }

  getMember(nickname: string): INickname {
    return this._attendees.filter(value => value.name === nickname)[0];
  }

  modifyResponse(attendee: INickname): void {
    const member = this.getMember(attendee.name);
    if (!member) {
      return;
    }
    this.getMember(attendee.name).responses = attendee.responses;
    this.persistToSessionStorage();
  }

  persistToSessionStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('config.attendees', JSON.stringify(this._attendees.map(value => value.serialize())));
    }
  }

  ngOnDestroy() {
    this.persistToSessionStorage();
  }

}
