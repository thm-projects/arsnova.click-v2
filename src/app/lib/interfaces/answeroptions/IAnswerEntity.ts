import { IValidationStackTrace } from '../IValidationStackTrace';

export interface IAnswerBase {
  readonly TYPE: string;
  isCorrect: boolean;
  answerText: string;
}

export interface IAnswerEntity {
  serialize(): IAnswerBase;

  isValid(): boolean;

  getValidationStackTrace(): Array<IValidationStackTrace>;

  equals(answer: IAnswerEntity): boolean;
}
