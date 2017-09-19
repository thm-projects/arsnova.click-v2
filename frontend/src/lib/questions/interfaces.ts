import {IAnswerOption} from '../answeroptions/interfaces';
import {ISessionConfiguration} from '../session_configuration/interfaces';

export declare interface IQuestionGroup {
  hashtag: string;
  isFirstStart: boolean;
  questionList: Array<IQuestion>;
  sessionConfig: ISessionConfiguration;

  serialize(): IQuestionGroup;

  addQuestion (question: IQuestion, index?: number): IQuestion | void;

  removeQuestion (index: number): void;

  isValid (): boolean;

  equals (questionGroup: IQuestionGroup): boolean;

  addDefaultQuestion (index: number, type?: string): void;
}

export interface IQuestion {

  readonly TYPE: string;
  readonly preferredAnsweroptionComponent: string;

  canAddAnsweroptions: boolean;

  canEditQuestionText: boolean;
  canEditAnsweroptions: boolean;
  canEditQuestionTimer: boolean;
  canEditQuestionType: boolean;

  answerOptionList: Array<IAnswerOption>;
  timer: number;
  questionText: string;

  isValid(): boolean;

  equals(question: IQuestion): boolean;

  serialize(): any;

  getValidationStackTrace(): Array<IValidationStackTrace>;

  translationReferrer(): string;

  translationDescription(): string;
}

export interface IQuestionChoice extends IQuestion {
  displayAnswerText: boolean;
  showOneAnswerPerRow: boolean;

  addDefaultAnswerOption(index?: number): void;
}

export interface IQuestionFreetext extends IQuestion {

}

export interface IQuestionRanged extends IQuestion {
  rangeMax: number;
  rangeMin: number;
  correctValue: number;
}

export interface IQuestionSurvey extends IQuestionChoice {
  multipleSelectionEnabled: boolean;
}

export interface IValidationStackTrace {
  occurredAt: {
    type: string;
  };
  reason: string;
}
