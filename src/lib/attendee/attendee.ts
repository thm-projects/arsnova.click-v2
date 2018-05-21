import { ICasData, INickname, INicknameSerialized, IQuizResponse } from 'arsnova-click-v2-types/src/common';

export class Attendee implements INickname {
  public webSocketAuthorization;
  public casProfile: ICasData;
  public webSocket;

  get groupName(): string {
    return this._groupName;
  }

  get colorCode(): string {
    return this._colorCode;
  }

  get id(): number {
    return this._id;
  }

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

  private readonly _id: number;
  private readonly _groupName: string;
  private readonly _colorCode: string;

  constructor({ id, name, groupName, colorCode, responses }: INicknameSerialized) {
    this._id = id;
    this._name = name;
    this._groupName = groupName;
    this._colorCode = colorCode;
    this._responses = responses || [];
  }

  public serialize(): INicknameSerialized {
    return {
      id: this.id,
      name: this.name,
      groupName: this.groupName,
      colorCode: this.colorCode,
      responses: this.responses,
    };
  }
}
