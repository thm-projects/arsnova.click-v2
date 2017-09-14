
import {QuestionI} from "./QuestionI";

export interface QuestionChoiceI extends QuestionI {
  displayAnswerText: boolean;
  showOneAnswerPerRow: boolean;

  addDefaultAnswerOption(index?: number): void;
}
