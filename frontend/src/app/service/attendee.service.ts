import {Injectable, OnDestroy} from '@angular/core';
import {CurrentQuizService} from './current-quiz.service';
import {FooterBarComponent} from '../footer/footer-bar/footer-bar.component';

export declare interface IQuizResponse {
  value: Array<number> | number | string;
  responseTime: number;
  confidence: number;
  readingConfirmation: boolean;
}

export declare interface INickname {
  id: number;
  name: string;
  colorCode: string;
  webSocket?: number;
  responses?: Array<IQuizResponse>;

  serialize(): Object;
}

class Player implements INickname {
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

  private _id: number;
  private _name: string;
  private _colorCode: string;
  private _responses: Array<IQuizResponse>;

  constructor({id, name, colorCode, responses}: INickname) {
    this._id = id;
    this._name = name;
    this._colorCode = colorCode;
    this._responses = responses || [];
  }

  serialize(): Object {
    return {
      id: this.id,
      name: this.name,
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

  constructor(private currentQuizService: CurrentQuizService) {
    const restoreAttendees = window.sessionStorage.getItem('_attendees');
    if (restoreAttendees) {
      this._attendees = JSON.parse(restoreAttendees).map((attendee) => {
        return new Player(attendee);
      });
      if (this._attendees.length) {
        FooterBarComponent.footerElemStartQuiz.isActive = true;
      }
    }
  }

  cleanUp(): void {
    this.attendees = [];
    window.sessionStorage.removeItem('_attendees');
  }

  addMember(attendee: INickname): void {
    if (!this.getMember(attendee.name)) {
      this._attendees.push(new Player(attendee));
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
    return name === window.sessionStorage.getItem(`${this.currentQuizService.hashtag}_nick`);
  }

  getOwnNick(): string {
    return window.sessionStorage.getItem(`${this.currentQuizService.hashtag}_nick`);
  }

  getMember(nickname: string): INickname {
    return this._attendees.filter(value => value.name === nickname)[0];
  }

  modifyResponse(attendee: INickname): void {
    this.getMember(attendee.name).responses = attendee.responses;
    this.persistToSessionStorage();
  }

  persistToSessionStorage(): void {
    window.sessionStorage.setItem('_attendees', JSON.stringify(this._attendees.map(value => value.serialize())));
  }

  ngOnDestroy() {
    this.persistToSessionStorage();
  }

}
