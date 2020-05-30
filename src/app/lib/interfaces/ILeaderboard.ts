import { IQuizResponse } from './quizzes/IQuizResponse';

export declare interface ILeaderBoardItem {
  name: string;
  responseTime: number;
  score: number;
  correctQuestions: Array<number>;
  confidenceValue: number;
}

export interface ILeaderboardMemberGroupItem {
  confidence: number;
  names: Array<string>;
  responseTimes: number;
  responses: Array<IQuizResponse>;
  score: number;
  _id: string;
}
