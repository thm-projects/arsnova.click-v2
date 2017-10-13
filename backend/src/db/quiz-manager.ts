import {IQuestionGroup} from '../interfaces/questions/interfaces';
import {WebSocketRouter} from '../routes/websocket';
import illegalNicks from '../nicknames/illegalNicks';
import {IActiveQuiz, INickname, IQuizResponse} from '../interfaces/common.interfaces';

const activeQuizzes: Object = {};

class Member implements INickname {
  get responses(): Array<IQuizResponse> {
    return this._responses;
  }
  set webSocket(value: number) {
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

  get webSocket(): number {
    return this._webSocket;
  }

  private _id: number;
  private _name: string;
  private _colorCode: string;
  private _webSocket: number;
  private _responses: Array<IQuizResponse>;

  constructor(
    {id, name, colorCode, responses}: { id: number, name: string, colorCode?: string, responses?: Array<IQuizResponse> }
    ) {
    this._id = id;
    this._name = name;
    this._colorCode = colorCode || this.generateRandomColorCode();
    this._responses = responses || [];
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
  private _currentQuestionIndex: number = 0;
  private _originalObject: IQuestionGroup;
  private _webSocketRouter: WebSocketRouter;

  constructor({nicknames, originalObject}: { nicknames: Array<INickname>, originalObject: IQuestionGroup }) {
    this._name = originalObject.hashtag;
    this._nicknames = nicknames;
    this._originalObject = originalObject;
    this._webSocketRouter = new WebSocketRouter(this);
  }

  public onDestroy(): void {
    this.webSocketRouter.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:DELETED',
      payload: {}
    });
  }

  public nextQuestion(): number {
    if (this.currentQuestionIndex < this.originalObject.questionList.length - 1) {
      this.currentQuestionIndex++;
      this.webSocketRouter.pushMessageToClients({
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

  public addMember(name: string, webSocketId: number): boolean {
    const foundMembers: number = this.findMemberByName(name).length;

    if (illegalNicks.indexOf(name) > -1) {
      throw new Error('LOBBY:ILLEGAL_NAME');
    }

    if (foundMembers === 0) {
      const member: INickname = new Member({id: this.nicknames.length, name});
      member.webSocket = webSocketId;
      this.nicknames.push(member);
      this.webSocketRouter.pushMessageToClients({
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
      this.webSocketRouter.pushMessageToClients({
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
    this.nicknames.filter(value => {return value.name === nickname; })[0].responses[questionIndex] = data;

    this.webSocketRouter.pushMessageToClients({
      status: 'STATUS:SUCCESSFUL',
      step: 'MEMBER:UPDATED_RESPONSE',
      payload: {
        nickname: this.nicknames.filter(value => {return value.name === nickname; })[0]
      }
    });
  }
}

export default class QuizManagerDAO {
  private static normalizeQuizName(quizName: string): string {
    return quizName.toLowerCase();
  }

  public static initActiveQuiz(quiz: IQuestionGroup): void {
    const name: string = QuizManagerDAO.normalizeQuizName(quiz.hashtag);
    if (activeQuizzes[name]) {
      return;
    }
    QuizManagerDAO.convertLegacyQuiz(quiz);
    activeQuizzes[name] = new ActiveQuizItem({nicknames: [], originalObject: quiz});
  }

  public static removeActiveQuiz(originalName: string): boolean {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    delete activeQuizzes[name];
    return typeof activeQuizzes[name] === 'undefined';
  }

  public static getActiveQuizByName(originalName: string): IActiveQuiz {
    const name: string = QuizManagerDAO.normalizeQuizName(originalName);
    return activeQuizzes[name];
  }

  public static updateActiveQuiz(data: IActiveQuiz): void {
    const name: string = QuizManagerDAO.normalizeQuizName(data.originalObject.hashtag);
    activeQuizzes[name] = data;
  }

  public static getAllActiveQuizzes(): Object {
    return activeQuizzes;
  }

  public static getAllActiveMembers(): number {
    return Object.keys(activeQuizzes).filter((value: string) => {
      const name: string = QuizManagerDAO.normalizeQuizName(value);
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
