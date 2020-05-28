import { AnswerState } from '../enums/AnswerState';

export interface IAnswerResult {
  state: AnswerState;
  amountCorrect: number;
  amountWrong: number;
  amountAvailable: number;
  pointsGained: number;
  rank: number;
}
