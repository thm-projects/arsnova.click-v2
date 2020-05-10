import { IMemberSerialized } from '../interfaces/entities/Member/IMemberSerialized';
import { IQuizResponse } from '../interfaces/quizzes/IQuizResponse';
import { ICasData } from '../interfaces/users/ICasData';

export class Attendee implements IMemberSerialized {
  private _responses: Array<IQuizResponse>;
  private _name: string;
  private _currentQuizName: string;
  private _ticket: string;
  private _id: string;
  private _groupName: string;
  private _colorCode: string;
  private _isActive: boolean;

  public casProfile: ICasData;

  get responses(): Array<IQuizResponse> {
    return this._responses;
  }

  set responses(value: Array<IQuizResponse>) {
    this._responses = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get currentQuizName(): string {
    return this._currentQuizName;
  }

  set currentQuizName(value: string) {
    this._currentQuizName = value;
  }

  get ticket(): string {
    return this._ticket;
  }

  set ticket(value: string) {
    this._ticket = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  get colorCode(): string {
    return this._colorCode;
  }

  set colorCode(value: string) {
    this._colorCode = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  constructor(member: IMemberSerialized) {
    this._id = member.id;
    this._name = member.name;
    this._groupName = member.groupName;
    this._currentQuizName = member.currentQuizName;
    this._colorCode = member.colorCode;
    this._responses = member.responses || [];
    this._ticket = member.ticket;
    this._isActive = member.isActive;
  }
}
