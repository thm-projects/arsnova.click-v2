import {IValidationStackTrace} from '../questions/interfaces';

export declare interface IAnswerOption {
  readonly TYPE: string;

  isCorrect: boolean;
  answerText: string;

  serialize(): any;

  isValid(): boolean;

  getValidationStackTrace(): Array<IValidationStackTrace>;

  equals(answer: IAnswerOption): boolean;
}

export declare interface IFreetextAnswerOption extends IAnswerOption {
  configCaseSensitive: boolean;
  configTrimWhitespaces: boolean;
  configUseKeywords: boolean;
  configUsePunctuation: boolean;

  isCorrectInput(ref: string): boolean;

  setConfig (configIdentifier: string, configValue: boolean): void;

  getConfig (): Array<Object>;

  serialize (): Object;

  equals (answerOption: IFreetextAnswerOption): boolean;
}
