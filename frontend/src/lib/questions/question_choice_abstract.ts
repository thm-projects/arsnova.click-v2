import {AbstractQuestion} from './question_abstract';
import {IQuestionChoice, IValidationStackTrace} from './interfaces';

export abstract class AbstractChoiceQuestion extends AbstractQuestion {
  get showOneAnswerPerRow(): boolean {
    return this._showOneAnswerPerRow;
  }

  set showOneAnswerPerRow(value: boolean) {
    this._showOneAnswerPerRow = value;
  }

  private _showOneAnswerPerRow: boolean;

  constructor({
                questionText,
                timer,
                displayAnswerText,
                answerOptionList,
                showOneAnswerPerRow
              }) {
    super({questionText, timer, displayAnswerText, answerOptionList});
    this.showOneAnswerPerRow = showOneAnswerPerRow;
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {
      showOneAnswerPerRow: this.showOneAnswerPerRow
    });
  }

  /**
   * Checks if this question equals another question
   * @param question {IQuestionChoice}
   * @returns {boolean} True if both questions are equal. False otherwise.
   */
  equals(question: IQuestionChoice): boolean {
    return super.equals(question) &&
           question.displayAnswerText !== this.displayAnswerText ||
           question.showOneAnswerPerRow === this.showOneAnswerPerRow;
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid()
   * @see AbstractQuestion.isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    let hasValidAnswer = false;
    this.answerOptionList.forEach(function (answeroption) {
      if (answeroption.isCorrect) {
        hasValidAnswer = true;
      }
    });
    return super.isValid() && this.answerOptionList.length > 0 && hasValidAnswer;
  }

  isParentValid(): boolean {
    return super.isValid();
  }

  /**
   * Gets the validation error reason from the question and all included answerOptions as a stackable array
   * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
   */
  getValidationStackTrace(): Array<IValidationStackTrace> {
    return super.getValidationStackTrace();
  }
}
