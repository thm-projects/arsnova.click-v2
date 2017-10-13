import {Injectable, OnDestroy} from '@angular/core';

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
}

class Player implements INickname {
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

  serialize(): INickname {
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

  constructor() {
    const restoreAttendees = window.sessionStorage.getItem('_attendees');
    if (restoreAttendees) {
      this._attendees = JSON.parse(restoreAttendees);
    }
  }

  addMember(attendee: INickname): void {
    if (!this.getMember(attendee.name)) {
      this._attendees.push(new Player(attendee));
    }
  }

  getMember(nickname: string): INickname {
    return this._attendees.filter(value => value.name === nickname)[0];
  }

  modifyResponse(attendee: INickname): void {
    this.getMember(attendee.name).responses = attendee.responses;
    window.sessionStorage.setItem('_attendees', JSON.stringify(this._attendees));
  }

  ngOnDestroy() {
    window.sessionStorage.setItem('_attendees', JSON.stringify(this._attendees));
  }

}
