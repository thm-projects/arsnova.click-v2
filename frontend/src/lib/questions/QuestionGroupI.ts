
import {QuestionI} from "./QuestionI";
import {SessionConfiguration} from "../session_configuration/session_config";

export declare interface QuestionGroupI {
  hashtag: string;
  isFirstStart: boolean;
  questionList: Array<QuestionI>;
  sessionConfig: SessionConfiguration;

  serialize(): any;
  addQuestion (question: QuestionI, index?: number): QuestionI | void;
  removeQuestion (index: number): void;
  isValid (): boolean;
  equals (questionGroup: QuestionGroupI): boolean;
  addDefaultQuestion (index: number, type?: string): void;
}
