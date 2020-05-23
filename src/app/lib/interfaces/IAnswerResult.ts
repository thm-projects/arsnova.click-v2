import { AnswerState } from '../enums/AnswerState';

export interface IAnswerResult {
  state: AnswerState;
  amountCorrect: number;
  amountAvailable: number;
  pointsGained: number;
  rank: number;
}
