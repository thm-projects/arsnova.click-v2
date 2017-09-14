
import {AnswerOptionI} from "../answeroptions/AnswerOptionI";

export interface QuestionI {

  readonly TYPE: string;
  readonly preferredAnsweroptionComponent: string;

  canAddAnsweroptions: boolean;

  canEditQuestionText: boolean;
  canEditAnsweroptions: boolean;
  canEditQuestionTimer: boolean;
  canEditQuestionType: boolean;

  answerOptionList: Array<AnswerOptionI>;
  timer: number;
  questionText: string;

  isValid(): boolean;
  equals(question: QuestionI): boolean;
  serialize(): any;
  getValidationStackTrace(): Array<ValidationStackTraceI>;
  translationReferrer(): string;
  translationDescription(): string;
}

export interface ValidationStackTraceI {
  occurredAt: {
    type: string;
  };
  reason: string;
}
