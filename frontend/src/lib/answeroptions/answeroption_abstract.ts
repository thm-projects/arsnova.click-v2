import {DefaultSettings} from '../../app/service/settings.service';
import {IAnswerOption} from './interfaces';
import {IValidationStackTrace} from '../questions/interfaces';

export abstract class AbstractAnswerOption {

  public answerText: string;
  public isCorrect: boolean;

  constructor({answerText, isCorrect = false}: { answerText: string, isCorrect?: boolean }) {
    this.answerText = answerText || DefaultSettings.defaultSettings.answers.answerText;
    this.isCorrect = isCorrect !== undefined ? isCorrect : DefaultSettings.defaultSettings.answers.isCorrect;
  }

  /**
   * @returns {Number} The answer text length without the markdown characters
   */
  getAnswerTextLengthWithoutMarkdownChars(): number {
    let tmpValue = this.answerText;
    tmpValue = tmpValue.replace(/#/g, '');
    tmpValue = tmpValue.replace(/\*/g, '');
    tmpValue = tmpValue.replace(/1./g, '');
    tmpValue = tmpValue.replace(/\[/g, '');
    tmpValue = tmpValue.replace(/\]\(/g, '');
    tmpValue = tmpValue.replace(/\)/g, '');
    tmpValue = tmpValue.replace(/- /g, '');
    tmpValue = tmpValue.replace(/\\\(/g, '');
    tmpValue = tmpValue.replace(/\\\)/g, '');
    tmpValue = tmpValue.replace(/$/g, '');
    tmpValue = tmpValue.replace(/<hlcode>/g, '');
    tmpValue = tmpValue.replace(/<\/hlcode>/g, '');
    tmpValue = tmpValue.replace(/>/g, '');
    return tmpValue.length;
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag: String, TYPE: String, questionIndex: Number, answerText: String, answerOptionNumber: Number}}
   */
  serialize(): any {
    return {
      answerText: this.answerText,
      isCorrect: this.isCorrect
    };
  }

  /**
   * Checks if the properties of this instance are valid.
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    return this.answerText.replace(/ /g, '').length > 0;
  }

  /**
   * Gets the validation error reason as a stackable array
   * @returns {Array} Contains an Object which holds the number of the current answerOption and the reason why the validation has failed
   */
  getValidationStackTrace(): Array<IValidationStackTrace> {
    return (this.answerText.length === 0) ? [{occurredAt: {type: 'answerOption'}, reason: 'answer_text_empty'}] : [];
  }

  /**
   * Checks for equivalence relations to another AnswerOption instance. Also part of the EJSON interface
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {AbstractAnswerOption} answerOption The AnswerOption instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  equals(answerOption: IAnswerOption): boolean {
    return answerOption.answerText === this.answerText && answerOption.isCorrect === this.isCorrect;
  }
}
