import {ValidationStackTraceI} from "../questions/QuestionI";

export interface AnswerOptionI {
  readonly TYPE: string;

  isCorrect: boolean;
  answerText: string;

  serialize(): any;
  isValid(): boolean;
  getValidationStackTrace(): Array<ValidationStackTraceI>;
  equals(answer: AnswerOptionI): boolean;
}
