import * as WebSocket from 'ws';
import {IQuestionGroup} from './questions/interfaces';
import {WebSocketRouter} from '../routes/websocket';

export declare interface IMathjaxFormat {
  format: 'TeX' | 'inline-TeX' | 'MathML';
  output: 'svg' | 'html' | 'mml';
}

export declare interface ICas {
  id: string;
  mail: string | Array<string>;
}

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

export declare interface INicknameSerialized {
  id: number;
  name: string;
  colorCode: string;
  responses: Array<IQuizResponse>;
}

export declare interface INickname extends INicknameSerialized {
  webSocket: WebSocket;
  webSocketAuthorization: number;
  casProfile: {id: string, mail: Array<string> | string};

  serialize(): INicknameSerialized;
}

export declare interface IActiveQuizSerialized {
  nicknames: Array<INicknameSerialized>;
  currentQuestionIndex: number;
  originalObject: IQuestionGroup;
}

export declare interface IActiveQuiz extends IActiveQuizSerialized {
  nicknames: Array<INickname>;
  name: string;
  webSocketRouter: WebSocketRouter;
  currentStartTimestamp: number;
  ownerSocket: WebSocket;

  addMember(name: string, webSocketAuthorization: number): boolean;

  removeMember(name: string): boolean;

  addResponseValue(nickname: string, data: Array<number>): void;

  setConfidenceValue(nickname: string, confidenceValue: number): void;

  setReadingConfirmation(nickname: string): void;

  requestReadingConfirmation(): void;

  nextQuestion(): number;

  setTimestamp(startTimestamp: number): void;

  stop(): void;

  reset(): void;

  updateQuizSettings(target: string, state: boolean): void;

  onDestroy(): void;

  serialize(): IActiveQuizSerialized;
}
