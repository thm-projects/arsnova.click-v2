import {DefaultAnswerOption} from '../answeroptions/answeroption_default';
import {DefaultSettings} from '../../app/service/settings.service';
import {answerOptionReflection} from '../answeroptions/answeroption_reflection';
import {IAnswerOption} from '../answeroptions/interfaces';
import {AbstractAnswerOption} from '../answeroptions/answeroption_abstract';
import {IQuestion, IValidationStackTrace} from './interfaces';

export abstract class AbstractQuestion {

  get questionText(): string {
    return this._questionText;
  }

  set questionText(value: string) {
    this._questionText = value;
  }

  get timer(): number {
    return this._timer;
  }

  set timer(value: number) {
    this._timer = value;
  }

  get displayAnswerText(): boolean {
    return this._displayAnswerText;
  }

  set displayAnswerText(value: boolean) {
    this._displayAnswerText = value;
  }

  get answerOptionList(): Array<IAnswerOption> {
    return this._answerOptionList;
  }

  set answerOptionList(value: Array<IAnswerOption>) {
    this._answerOptionList = value;
  }

  private _questionText: string;
  private _timer: number;
  private _displayAnswerText: boolean;
  private _answerOptionList: Array<IAnswerOption>;

  constructor({
                questionText = DefaultSettings.defaultSettings.question.text,
                timer = DefaultSettings.defaultSettings.question.timer,
                displayAnswerText = DefaultSettings.defaultSettings.answers.displayAnswerTextOnButtons,
                answerOptionList = Array<IAnswerOption>()
              }) {
    this.questionText = questionText;
    this.timer = timer;
    this.displayAnswerText = displayAnswerText;
    if (answerOptionList.length > 0) {
      answerOptionList.forEach(function (answerOption: any, index: number) {
        if (!(answerOption instanceof AbstractAnswerOption)) {
          answerOptionList[index] = answerOptionReflection[answerOption.TYPE](answerOption);
        }
      })
    }
    this.answerOptionList = answerOptionList;
  }

  /**
   * Adds a new AnswerOption to the Question instance
   * @param {IAnswerOption} answerOption The AnswerOption instance to be added
   * @param {Number} [index] An optional index where the AnswerOption instance should be added. If not set or set to an invalid value the instance is added to the end of the answerOptionList
   * @throws {Error} If the answerOption is not of type IAnswerOption
   */
  addAnswerOption(answerOption: IAnswerOption, index: number = -1): void {
    if (index < 0 || index >= this.answerOptionList.length) {
      this.answerOptionList.push(answerOption);
    } else {
      this.answerOptionList.splice(index, 0, answerOption);
    }
  }

  /**
   * Removes an AnswerOption from the answerOptionList
   * @param {Number} index The index of the AnswerOption instance which shall be removed
   * @throws {Error} If the index is not set or set to an invalid value
   */
  removeAnswerOption(index: number): void {
    if (index < 0 || index > this.answerOptionList.length) {
      throw new Error('Invalid argument for Question.removeAnswerOption');
    }
    this.answerOptionList.splice(index, 1);
  }

  /**
   * Removes all AnswerOption instances in the answerOptionList.
   * The AnswerOption instance objects are not destroyed
   */
  removeAllAnswerOptions(): void {
    this.answerOptionList.splice(0, this.answerOptionList.length);
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
   */
  serialize(): Object {
    let answerOptionListSerialized = Array<IAnswerOption>();
    this.answerOptionList.forEach(function (answeroption) {
      answerOptionListSerialized.push(answeroption.serialize());
    });
    return {
      questionText: this.questionText,
      timer: this.timer,
      displayAnswerText: this.displayAnswerText,
      answerOptionList: answerOptionListSerialized
    };
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    let answerOptionListValid = true;
    this.answerOptionList.forEach(function (answerOption) {
      if (!answerOption.isValid()) {
        answerOptionListValid = false;
      }
    });
    const questionTextWithoutMarkdownChars = this.getQuestionTextWithoutMarkdownChars().length;

    // hard coded checkup values are ugly, but the schema import seems to be messed up here...
    return answerOptionListValid && questionTextWithoutMarkdownChars > 4 && questionTextWithoutMarkdownChars < 50001 && this.timer > 0;
  }

  /**
   * @returns {String} The question text without the markdown characters
   */
  getQuestionTextWithoutMarkdownChars(): string {
    return this.questionText.replace(/#/g, '').replace(/\*/g, '').replace(/1./g, '').replace(/\[/g, '').replace(/\]\(/g, '').replace(/\)/g, '').replace(/- /g, '').replace(/ /g, '').replace(/\\\(/g, '').replace(/\\\)/g, '').replace(/$/g, '').replace(/<hlcode>/g, '').replace(/<\/hlcode>/g, '').replace(/>/g, '');
  }

  /**
   * Gets the validation error reason from the question and all included answerOptions as a stackable array
   * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
   */
  getValidationStackTrace(): Array<IValidationStackTrace> {
    let result = Array<IValidationStackTrace>();
    const questionTextWithoutMarkdownChars = this.getQuestionTextWithoutMarkdownChars().length;
    if (questionTextWithoutMarkdownChars < 5) {
      result.push({occurredAt: {type: 'question'}, reason: 'question_text_too_small'});
    } else if (questionTextWithoutMarkdownChars > 50000) {
      result.push({occurredAt: {type: 'question'}, reason: 'question_text_too_long'});
    }
    if (this.timer < 1) {
      result.push({occurredAt: {type: 'question'}, reason: 'timer_too_small'});
    }
    this.answerOptionList.forEach(function (answerOption) {
      if (!answerOption.isValid()) {
        result = result.concat(...answerOption.getValidationStackTrace());
      }
    });
    return result;
  }

  /**
   * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {IQuestion} question The Question instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  equals(question: IQuestion): boolean {
    let questionAnswerOptionList = question.answerOptionList;
    if (questionAnswerOptionList.length === this.answerOptionList.length) {
      let isEqual = true;
      for (let i = 0; i < this.answerOptionList.length; i++) {
        if (isEqual && !this.answerOptionList[i].equals(questionAnswerOptionList[i])) {
          isEqual = false;
        }
      }
      if (question.timer !== this.timer ||
        question.questionText !== this.questionText) {
        isEqual = false;
      }
      return isEqual;
    }
  }

  /**
   * Quick way to insert a default AnswerOption to the Question instance.
   * @param {Number} [index] The index where the AnswerOption should be inserted. If not passed, it will be added to the end of the answerOptionList
   */
  addDefaultAnswerOption(index = -1): void {
    if (index === -1 || index >= this.answerOptionList.length) {
      index = this.answerOptionList.length;
    }
    this.addAnswerOption(
      new DefaultAnswerOption({
        answerText: '',
        isCorrect: false
      }),
      index
    );
  }
}
