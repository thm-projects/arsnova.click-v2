import * as WebSocket from 'ws';
import {IQuestionGroup} from '../interfaces/questions/interfaces';
import {WebSocketRouter} from '../routes/websocket';
import illegalNicks from '../nicknames/illegalNicks';
import {IActiveQuiz, IActiveQuizSerialized, ICas, INickname, IQuizResponse, INicknameSerialized} from '../interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from './DbDao';
import {parseCachedAssetQuiz} from '../cache/assets';

const privateServerConfig = require('../../settings.json');
privateServerConfig.public.limitActiveQuizzes = parseFloat(privateServerConfig.public.limitActiveQuizzes);
const publicServerConfig = privateServerConfig.public;

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
  private _currentQuestionIndex: number;
  private _originalObject: IQuestionGroup;
  private _webSocketRouter: WebSocketRouter;
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
    this._webSocketRouter = new WebSocketRouter();
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
      } else if (value.webSocket) {} else {
        console.log('websocket for nickname', value.name, 'is undefined');
      }
    });
    if (this._ownerSocket && this._ownerSocket.readyState === WebSocket.OPEN) {
      this._ownerSocket.send(JSON.stringify(message));
    } else if (this._ownerSocket) {} else {
      console.log('no owner socket defined');
    }
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

const activeQuizzes: Object = {};
DbDao.getState()[DatabaseTypes.quiz].forEach(value => {
  return activeQuizzes[value.quizName.toLowerCase()] = new ActiveQuizItemPlaceholder(value.quizName);
});

export default class QuizManagerDAO {
  private static normalizeQuizName(quizName: string): string {
    return quizName ? quizName.toLowerCase() : '';
  }

  private static checkABCDOrdering(hashtag: string): boolean {
    let ordered = true;
    if (!hashtag || hashtag.length < 2 || hashtag.charAt(0) !== 'a') {
      return false;
    }
    for (let i = 1; i < hashtag.length; i++) {
      if (hashtag.charCodeAt(i) !== hashtag.charCodeAt(i - 1) + 1) {
        ordered = false;
        break;
      }
    }
    return ordered;
  }

  public static getRenameRecommendations(quizName: string): Array<string> {
    const result = [];
    const count = Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return name.startsWith(quizName.toLowerCase());
    }).length;
    const date = new Date();
    const dateYearPart = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    const dateFormatted = `${dateYearPart}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    result.push(`${quizName} ${count + 1}`);
    result.push(`${quizName} ${dateFormatted}`);
    result.push(`${quizName}_${Math.random()}`);
    return result;
  }

  public static setQuizAsInactive(quizName: string): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quizName);
    if (activeQuizzes[name]) {
      activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
    }
  }

  public static initInactiveQuiz(quizName: string, privateKey: string): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quizName);
    if (activeQuizzes[name]) {
      return;
    }
    activeQuizzes[name] = new ActiveQuizItemPlaceholder(name);
  }

  public static initActiveQuiz(quiz: IQuestionGroup): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(quiz.hashtag);
    if (activeQuizzes[name] && !(activeQuizzes[name] instanceof ActiveQuizItemPlaceholder)) {
      return;
    }
    QuizManagerDAO.convertLegacyQuiz(quiz);
    if (privateServerConfig.public.cacheQuizAssets) {
      parseCachedAssetQuiz(quiz.questionList);
    }
    activeQuizzes[name] = new ActiveQuizItem({nicknames: [], originalObject: quiz});
    return activeQuizzes[name];
  }

  public static removeQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    if (!activeQuizzes[name]) {
      return;
    }
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

  public static getPersistedQuizByName(originalName: string): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name];
  }

  public static isActiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name] && activeQuizzes[name] instanceof ActiveQuizItem;
  }

  public static isInactiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
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

  public static getAllPersistedDemoQuizzes(): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return activeQuizzes[name].name.toLowerCase().startsWith('demo quiz');
    });
  }

  public static getAllPersistedAbcdQuizzes(): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return QuizManagerDAO.checkABCDOrdering(activeQuizzes[name].name);
    });
  }

  public static getAllPersistedAbcdQuizzesByLength(length: number): String[] {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
      return QuizManagerDAO.checkABCDOrdering(activeQuizzes[name].name) &&
        activeQuizzes[name].originalObject.questionList[0].answerOptionList.length === length;
    });
  }

  private static replaceTypeInformationOnLegacyQuiz(obj): void {
    if (obj.hasOwnProperty('type')) {
      obj.TYPE = obj.type;
      delete obj.type;
      Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
          obj[key].forEach((elem, index) => {
            this.replaceTypeInformationOnLegacyQuiz(obj[key][index]);
          });
        } else if (obj[key] instanceof Object) {
          this.replaceTypeInformationOnLegacyQuiz(obj[key]);
        }
      });
    }
  }

  public static convertLegacyQuiz(legacyQuiz: any): void {
    QuizManagerDAO.replaceTypeInformationOnLegacyQuiz(legacyQuiz);
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
