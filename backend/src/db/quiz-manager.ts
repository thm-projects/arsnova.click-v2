import * as WebSocket from 'ws';
import {IQuestionGroup} from '../interfaces/questions/interfaces';
import {WebSocketRouter} from '../routes/websocket';
import illegalNicks from '../nicknames/illegalNicks';
import {IActiveQuiz, ICas, INickname, IQuizResponse} from '../interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from './DbDao';

class Member implements INickname {
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
    let hash: number = 0;
    for (let i: number = 0; i < str.length; i++) {
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

  public serialize(): Object {
    return {
      id: this.id,
      name: this.name,
      colorCode: this.colorCode,
      responses: this.responses
    };
  }
}

class ActiveQuizItem implements IActiveQuiz {
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

  get webSocketRouter(): WebSocketRouter {
    return this._webSocketRouter;
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
  private _currentQuestionIndex: number = -1;
  private _originalObject: IQuestionGroup;
  private _webSocketRouter: WebSocketRouter;
  private _currentStartTimestamp: number;
  private _ownerSocket: WebSocket;

  constructor({nicknames, originalObject}: { nicknames: Array<INickname>, originalObject: IQuestionGroup }) {
    this._name = originalObject.hashtag;
    this._nicknames = nicknames;
    this._originalObject = originalObject;
    this._webSocketRouter = new WebSocketRouter();
  }

  public onDestroy(): void {
    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:DELETED',
      payload: {}
    });
  }

  private pushMessageToClients(message: any): void {
    this._nicknames.forEach(value => {
      if (value.webSocket && value.webSocket.readyState === WebSocket.OPEN) {
        value.webSocket.send(JSON.stringify(message));
      }
    });
    if (this._ownerSocket) {
      this._ownerSocket.send(JSON.stringify(message));
    } else {
      console.log('no owner socket defined');
    }
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

    setTimeout(() => this._currentStartTimestamp = 0,
               this.originalObject.questionList[this.currentQuestionIndex].timer * 1000);

    this.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:START',
      payload: { startTimestamp }
    });
  }

  public nextQuestion(): number {
    if (this.currentQuestionIndex < this.originalObject.questionList.length - 1) {
      this.currentQuestionIndex++;
      this.pushMessageToClients({
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:NEXT_QUESTION',
        payload: {
          question: this.originalObject.questionList[this.currentQuestionIndex]
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

  public addMember(name: string, webSocketAuthorization: number): boolean {
    const foundMembers: number = this.findMemberByName(name).length;

    if (illegalNicks.indexOf(name.toUpperCase()) > -1) {
      throw new Error('LOBBY:ILLEGAL_NAME');
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
      this.nicknames.splice(this.nicknames.indexOf(foundMembers[0]), 1);
      this.pushMessageToClients({
        status: 'STATUS:SUCCESSFUL',
        step: 'MEMBER:REMOVED',
        payload: {
          name: name
        }
      });
      return true;
    }
    return false;
  }

  public addResponse(nickname: string, questionIndex: number, data: IQuizResponse): void {
    this.nicknames.filter(value => {
      return value.name === nickname;
    })[0].responses[questionIndex] = data;

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

class ActiveQuizItemPlaceholder implements IActiveQuiz {
  public name: string;
  public nicknames: INickname[];
  public currentQuestionIndex: number;
  public originalObject: IQuestionGroup;
  public webSocketRouter: WebSocketRouter;
  public currentStartTimestamp: number;
  public webSocketAuthorization: number;
  public ownerSocket: WebSocket;

  constructor(name: string) {
    this.name = name;
  }

  public addMember(name: string, webSocketAuthorization: number): boolean {
    throw new Error('Method not implemented.');
  }

  public removeMember(name: string): boolean {
    throw new Error('Method not implemented.');
  }

  public addResponse(nickname: string, questionIndex: number, data: IQuizResponse): void {
    throw new Error('Method not implemented.');
  }

  public nextQuestion(): number {
    throw new Error('Method not implemented.');
  }

  public setTimestamp(startTimestamp: number): void {
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

const activeQuizzes: Object = {};
DbDao.getState()[DatabaseTypes.quiz].forEach(value => {
  return activeQuizzes[value.quizName] = new ActiveQuizItemPlaceholder(value.quizName);
});

export default class QuizManagerDAO {
  private static normalizeQuizName(quizName: string): string {
    return quizName.toLowerCase();
  }

  public static initInactiveQuiz(quizName: string, privateKey: string): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quizName);
    if (activeQuizzes[name]) {
      return;
    }
    activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
  }

  public static initActiveQuiz(quiz: IQuestionGroup): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quiz.hashtag);
    if (activeQuizzes[name] && !(activeQuizzes[name] instanceof ActiveQuizItemPlaceholder)) {
      return;
    }
    QuizManagerDAO.convertLegacyQuiz(quiz);
    activeQuizzes[name] = new ActiveQuizItem({nicknames: [], originalObject: quiz});
  }

  public static removeActiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
    return true;
  }

  public static removeQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    delete activeQuizzes[name];
    return true;
  }

  public static getActiveQuizByName(originalName: string): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
      return;
    }
    return activeQuizzes[name];
  }

  public static updateActiveQuiz(data: IActiveQuiz): void {
    const name: string = QuizManagerDAO.normalizeQuizName(data.originalObject.hashtag);
    if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
      return;
    }
    activeQuizzes[name] = data;
  }

  public static getAllActiveQuizNames(): Array<string> {
    return Object.keys(activeQuizzes)
                 .filter(name => !this.isInactiveQuiz(name));
  }

  public static getAllPersistedQuizzes(): Object {
    return activeQuizzes;
  }

  public static isInactiveQuiz(name: string): boolean {
    return activeQuizzes[name] && activeQuizzes[name] instanceof ActiveQuizItemPlaceholder;
  }

  public static getAllActiveMembers(): number {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      if (activeQuizzes[name] instanceof ActiveQuizItemPlaceholder) {
        return;
      }
      return activeQuizzes[name].nicknames.length;
    }).reduce((a: number, b: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(b);
      return parseInt(a + activeQuizzes[name].nicknames.length, 10);
    },        0);
  }

  public static getAllActiveDemoQuizzes(): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return activeQuizzes[name].name.toLowerCase().startsWith('demo quiz');
    });
  }

  public static convertLegacyQuiz(legacyQuiz: any): void {
    if (legacyQuiz.hasOwnProperty('configuration')) {
      // Detected old v1 arsnova.click quiz
      legacyQuiz.sessionConfig = {
        music: {
          titleConfig: {
            lobby: legacyQuiz.configuration.music.lobbyTitle,
            countdownRunning: legacyQuiz.configuration.music.countdownRunningTitle,
            countdownEnd: legacyQuiz.configuration.music.countdownEndTitle
          },
          volumeConfig: {
            global: legacyQuiz.configuration.music.lobbyVolume,
            lobby: legacyQuiz.configuration.music.lobbyVolume,
            countdownRunning: legacyQuiz.configuration.music.countdownRunningVolume,
            countdownEnd: legacyQuiz.configuration.music.countdownEndVolume,
            useGlobalVolume: legacyQuiz.configuration.music.isUsingGlobalVolume,
          },
          lobbyEnabled: legacyQuiz.configuration.music.lobbyEnabled,
          countdownRunningEnabled: legacyQuiz.configuration.music.countdownRunningEnabled,
          countdownEndEnabled: legacyQuiz.configuration.music.countdownEndEnabled
        },
        nicks: {
          selectedNicks: legacyQuiz.configuration.nicks.selectedValues,
          blockIllegalNicks: legacyQuiz.configuration.nicks.blockIllegal,
          restrictToCasLogin: legacyQuiz.configuration.nicks.restrictToCASLogin
        },
        theme: legacyQuiz.configuration.theme,
        readingConfirmationEnabled: legacyQuiz.configuration.readingConfirmationEnabled,
        showResponseProgress: legacyQuiz.configuration.showResponseProgress,
        confidenceSliderEnabled: legacyQuiz.configuration.confidenceSliderEnabled
      };
      delete legacyQuiz.configuration;
    }
  }
}
