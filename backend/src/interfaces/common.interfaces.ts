import {IQuestionGroup} from './questions/interfaces';

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

  addMember(name: string, webSocketId: number): boolean;
  removeMember(name: string): boolean;

  addResponse(nickname: string, questionIndex: number, data: IQuizResponse): void;

  onDestroy(): void;
}
