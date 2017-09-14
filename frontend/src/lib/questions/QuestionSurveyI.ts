import {QuestionChoiceI} from "./QuestionChoiceI";

export interface QuestionSurveyI extends QuestionChoiceI {
  multipleSelectionEnabled: boolean;
}
