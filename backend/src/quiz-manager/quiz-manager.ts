import * as WebSocket from 'ws';
import {IQuestionGroup} from '../interfaces/questions/interfaces';
import illegalNicks from '../nicknames/illegalNicks';
import {IActiveQuiz, IActiveQuizSerialized, ICas, INickname, IQuizResponse, INicknameSerialized} from '../interfaces/common.interfaces';

export class Member implements INickname {
  get casProfile(): ICas {
    return this._casProfile;
  }
  set webSocketAuthorization(value: number) {
    this._webSocketAuthorization = value;
  }
  get webSocketAuthorization(): number {
    return this._webSocketAuthorization;
  }
  get responses(): Array<IQuizResponse> {
    return this._responses;
  }

  set webSocket(value: WebSocket) {
    this._webSocket = value;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get colorCode(): string {
    return this._colorCode;
  }

  get webSocket(): WebSocket {
    return this._webSocket;
  }

  private _id: number;
  private _name: string;
  private _colorCode: string;
  private _webSocket: WebSocket;
  private _webSocketAuthorization: number;
  private _responses: Array<IQuizResponse>;
  private _casProfile: ICas;

  constructor(
    {id, name, colorCode, responses, webSocketAuthorization}:
      { id: number, name: string, colorCode?: string, responses?: Array<IQuizResponse>, webSocketAuthorization: number}) {
    this._id = id;
    this._name = name;
    this._colorCode = colorCode || this.generateRandomColorCode();
    this._responses = responses || [];
    this._webSocketAuthorization = webSocketAuthorization;
  }

  private hashCode(str: string): number { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private intToRGB(i: number): string {
    const c: string = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
  }

  private generateRandomColorCode(): string {
    return this.intToRGB(this.hashCode(this.name));
  }

  public serialize(): INicknameSerialized {
    return {
      id: this.id,
      name: this.name,
      colorCode: this.colorCode,
      responses: this.responses
    };
  }
}

export class ActiveQuizItem implements IActiveQuiz {
  get ownerSocket(): WebSocket {
    return this._ownerSocket;
  }

  set ownerSocket(value: WebSocket) {
    this._ownerSocket = value;
  }
  get currentStartTimestamp(): number {
    return this._currentStartTimestamp;
  }
  set currentQuestionIndex(value: number) {
    this._currentQuestionIndex = value;
  }

  get originalObject(): IQuestionGroup {
    return this._originalObject;
  }

  get currentQuestionIndex(): number {
    return this._currentQuestionIndex;
  }

  get nicknames(): Array<INickname> {
    return this._nicknames;
  }

  get name(): string {
    return this._name;
  }

  private _name: string;
  private _nicknames: Array<INickname>;
  private _currentQuestionIndex: number;
  private _originalObject: IQuestionGroup;
  private _currentStartTimestamp = 0;
  private _ownerSocket: WebSocket;
  private _countdownInterval: any;

  constructor(
    {nicknames, originalObject, currentQuestionIndex}:
    { nicknames: Array<INickname>, originalObject: IQuestionGroup, currentQuestionIndex?: number }
    ) {
    this._name = originalObject.hashtag;
    this._nicknames = nicknames;
    this._originalObject = originalObject;
    this._currentQuestionIndex = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : -1;
  }

  public serialize(): IActiveQuizSerialized {
    return {
      nicknames: this._nicknames.map(nick => nick.serialize()),
      originalObject: this._originalObject,
      currentQuestionIndex: this._currentQuestionIndex
    };
  }

  public onDestroy(): void {
    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'LOBBY:CLOSED',
      payload: {}
    });
  }

  private pushMessageToClients(message: any): void {
    this._nicknames.forEach(value => {
      if (value.webSocket && value.webSocket.readyState === WebSocket.OPEN) {
        value.webSocket.send(JSON.stringify(message));
      } else if (value.webSocket) {} else {}
    });
    if (this._ownerSocket && this._ownerSocket.readyState === WebSocket.OPEN) {
      this._ownerSocket.send(JSON.stringify(message));
    } else if (this._ownerSocket) {} else {}
  }

  public requestReadingConfirmation(): void {
    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:READING_CONFIRMATION_REQUESTED',
      payload: {}
    });
  }

  public reset(): void {
    this._currentQuestionIndex = -1;
    this._currentStartTimestamp = 0;
    this._nicknames.forEach((member) => {
      member.responses.splice(0, member.responses.length);
    });
    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:RESET',
      payload: {}
    });
  }

  public setTimestamp(startTimestamp: number): void {
    this._currentStartTimestamp = startTimestamp;

    let timer = this.originalObject.questionList[this.currentQuestionIndex].timer;
    this._countdownInterval = setInterval(() => {
      if (
        !timer || this.nicknames.filter(nick => {
          if (!nick.responses[this.currentQuestionIndex]) {
            return false;
          }
          const value = nick.responses[this.currentQuestionIndex].value;
          return typeof value === 'number' ? !isNaN(value) : value.length;
        }).length === this.nicknames.length
      ) {
        clearInterval(this._countdownInterval);
        this._currentStartTimestamp = 0;
      } else {
        timer--;
      }
    }, 1000);

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:START',
      payload: { startTimestamp }
    });
  }

  public stop(): void {
    clearInterval(this._countdownInterval);
    this._currentStartTimestamp = 0;

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:STOP',
      payload: {}
    });
  }

  public nextQuestion(): number {
    if (this.currentQuestionIndex < this.originalObject.questionList.length - 1) {
      this.currentQuestionIndex++;
      this.nicknames.forEach(member => member.responses.push({value: [], responseTime: 0, confidence: 0, readingConfirmation: false}));
      this.pushMessageToClients({
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:NEXT_QUESTION',
        payload: {
          questionIndex: this.currentQuestionIndex
        }
      });
      return this.currentQuestionIndex;
    } else {
      return -1;
    }
  }

  public findMemberByName(name: string): Array<INickname> {
    return this.nicknames.filter((nicks) => {
      return nicks.name === name;
    });
  }

  public addMember(name: string, webSocketAuthorization: number, profile?: ICas): boolean {
    const foundMembers: number = this.findMemberByName(name).length;

    if (this.originalObject.sessionConfig.nicks.blockIllegalNicks && illegalNicks.indexOf(name.toUpperCase()) > -1) {
      throw new Error('LOBBY:ILLEGAL_NAME');
    }
    if (this.originalObject.sessionConfig.nicks.restrictToCasLogin && !profile) {
      throw new Error('LOBBY:CAS_LOGIN_REQUIRED');
    }

    if (foundMembers === 0) {
      const member: INickname = new Member({id: this.nicknames.length, name, webSocketAuthorization});
      this.nicknames.push(member);
      this.pushMessageToClients({
        status: 'STATUS:SUCCESSFUL',
        step: 'MEMBER:ADDED',
        payload: {member: member.serialize()}
      });
      return true;
    } else {
      throw new Error('LOBBY:DUPLICATE_LOGIN');
    }
  }

  public removeMember(name: string): boolean {
    const foundMembers: Array<INickname> = this.findMemberByName(name);
    if (foundMembers.length === 1) {
      this.pushMessageToClients({
        status: 'STATUS:SUCCESSFUL',
        step: 'MEMBER:REMOVED',
        payload: {
          name: name
        }
      });
      this.nicknames.splice(this.nicknames.indexOf(foundMembers[0]), 1);
      return true;
    }
    return false;
  }

  public addResponseValue(nickname: string, data: Array<number>): void {
    this.nicknames.filter(value => {
      return value.name === nickname;
    })[0].responses[this.currentQuestionIndex].responseTime = (new Date().getTime() - this._currentStartTimestamp) / 1000;
    this.nicknames.filter(value => {
      return value.name === nickname;
    })[0].responses[this.currentQuestionIndex].value = data;

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'MEMBER:UPDATED_RESPONSE',
      payload: {
        nickname: this.nicknames.filter(value => {
          return value.name === nickname;
        })[0].serialize()
      }
    });
  }

  public setConfidenceValue(nickname: string, confidenceValue: number): void {
    this.nicknames.filter(member => {
      return member.name === nickname;
    })[0].responses[this.currentQuestionIndex].confidence = confidenceValue;

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'MEMBER:UPDATED_RESPONSE',
      payload: {
        nickname: this.nicknames.filter(value => {
          return value.name === nickname;
        })[0].serialize()
      }
    });
  }

  public setReadingConfirmation(nickname: string): void {
    this.nicknames.filter(member => {
      return member.name === nickname;
    })[0].responses[this.currentQuestionIndex].readingConfirmation = true;

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'MEMBER:UPDATED_RESPONSE',
      payload: {
        nickname: this.nicknames.filter(value => {
          return value.name === nickname;
        })[0].serialize()
      }
    });
  }

  public updateQuizSettings(target: string, state: boolean): void {
    this.originalObject.sessionConfig[target] = state;

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:UPDATED_SETTINGS',
      payload: {
        target, state
      }
    });
  }
}

export class ActiveQuizItemPlaceholder implements IActiveQuiz {
  public name: string;
  public nicknames: INickname[];
  public currentQuestionIndex: number;
  public originalObject: IQuestionGroup;
  public currentStartTimestamp: number;
  public webSocketAuthorization: number;
  public ownerSocket: WebSocket;

  constructor(name: string) {
    this.name = name;
  }

  public serialize(): IActiveQuizSerialized {
    throw new Error('Method not implemented.');
  }

  public requestReadingConfirmation(): void {
    throw new Error('Method not implemented.');
  }

  public setConfidenceValue(nickname: string, confidenceValue: number): void {
    throw new Error('Method not implemented.');
  }

  public setReadingConfirmation(nickname: string): void {
    throw new Error('Method not implemented.');
  }

  public addMember(name: string, webSocketAuthorization: number): boolean {
    throw new Error('Method not implemented.');
  }

  public removeMember(name: string): boolean {
    throw new Error('Method not implemented.');
  }

  public addResponseValue(nickname: string, data: Array<number>): void {
    throw new Error('Method not implemented.');
  }

  public nextQuestion(): number {
    throw new Error('Method not implemented.');
  }

  public setTimestamp(startTimestamp: number): void {
    throw new Error('Method not implemented.');
  }

  public stop(): void {
    throw new Error('Method not implemented.');
  }

  public reset(): void {
    throw new Error('Method not implemented.');
  }

  public onDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public updateQuizSettings(target: string, state: boolean): void {
    throw new Error('Method not implemented.');
  }
}
