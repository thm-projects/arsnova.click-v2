import {IQuestionGroup} from './questions/interfaces';
import {WebSocketRouter} from '../routes/websocket';

export declare interface ITheme {
  name: string;
  description: string;
  id: string;
}

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
  webSocket: number;
  responses: Array<IQuizResponse>;

  serialize(): Object;
}

export declare interface IActiveQuiz {
  name: string;
  nicknames: Array<INickname>;
  currentQuestionIndex: number;
  originalObject: IQuestionGroup;
  webSocketRouter: WebSocketRouter;
  currentStartTimestamp: number;

  addMember(name: string, webSocketId: number): boolean;

  removeMember(name: string): boolean;

  addResponse(nickname: string, questionIndex: number, data: IQuizResponse): void;

  nextQuestion(): number;

  setTimestamp(startTimestamp: number): void;

  reset(): void;

  updateQuizSettings(target: string, state: boolean): void;

  onDestroy(): void;
}
