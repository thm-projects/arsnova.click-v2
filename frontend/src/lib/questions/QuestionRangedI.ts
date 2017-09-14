import {QuestionI} from "./QuestionI";

export interface QuestionRangedI extends QuestionI {
  rangeMax: number;
  rangeMin: number;
  correctValue: number;
}
