import { ICasData, IQuizResponse } from 'arsnova-click-v2-types/dist/common';
import { IMemberSerialized } from '../interfaces/entities/Member/IMemberSerialized';

export class Attendee implements IMemberSerialized {
  public casProfile: ICasData;
  public webSocket;
  public webSocketAuthorization: number;

  private _responses: Array<IQuizResponse>;

  get responses(): Array<IQuizResponse> {
    return this._responses;
  }

  set responses(value: Array<IQuizResponse>) {
    this._responses = value;
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _currentQuizName: string;

  get currentQuizName(): string {
    return this._currentQuizName;
  }

  set currentQuizName(value: string) {
    this._currentQuizName = value;
  }

  private _ticket: string;

  get ticket(): string {
    return this._ticket;
  }

  set ticket(value: string) {
    this._ticket = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _groupName: string;

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  private _colorCode: string;

  get colorCode(): string {
    return this._colorCode;
  }

  set colorCode(value: string) {
    this._colorCode = value;
  }

  constructor(member: IMemberSerialized) {
    this._id = member.id;
    this._name = member.name;
    this._groupName = member.groupName;
    this._colorCode = member.colorCode;
    this._responses = member.responses || [];
    this._ticket = member.ticket;
  }
}
