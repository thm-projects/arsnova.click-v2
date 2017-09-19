import {AbstractQuestion} from './question_abstract';
import {IQuestionRanged, IValidationStackTrace} from './interfaces';

export class RangedQuestion extends AbstractQuestion implements IQuestionRanged {

  canEditQuestionText: boolean = true;
  canEditAnsweroptions: boolean = true;
  canEditQuestionTimer: boolean = true;
  canEditQuestionType: boolean = true;

  canAddAnsweroptions: boolean = false;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsRangedComponent';

  get rangeMin(): number {
    return this._rangeMin;
  }

  set rangeMin(value: number) {
    this._rangeMin = value;
  }

  get rangeMax(): number {
    return this._rangeMax;
  }

  set rangeMax(value: number) {
    this._rangeMax = value;
  }

  get correctValue(): number {
    return this._correctValue;
  }

  set correctValue(value: number) {
    this._correctValue = value;
  }

  public TYPE: string = 'RangedQuestion';

  private _rangeMin: number = 0;
  private _rangeMax: number = 0;
  private _correctValue: number = 0;

  /**
   * Constructs a RangedQuestion instance
   * @see AbstractQuestion.constructor()
   */
  constructor({questionText, timer, rangeMin, rangeMax, correctValue}) {
    super({questionText, timer});
    this.removeAllAnswerOptions();
    this.rangeMin = rangeMin;
    this.rangeMax = rangeMax;
    this.correctValue = correctValue;
  }

  /**
   * Serialized the instance object to a JSON compatible object
   * @see AbstractQuestion.serialize()
   * @returns {{hashtag, questionText, type, timer, startTime, questionIndex, answerOptionList}|{hashtag: String, questionText: String, type: AbstractQuestion, timer: Number, startTime: Number, questionIndex: Number, answerOptionList: Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {
      type: this.TYPE,
      rangeMin: this.rangeMin,
      rangeMax: this.rangeMax,
      correctValue: this.correctValue
    });
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid(). Checks if the Question has no answers set and if min range is smaller than max range
   * @see AbstractQuestion.isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    return super.isValid() &&
      this.answerOptionList.length === 0 &&
      this.rangeMin < this.rangeMax &&
      this.correctValue >= this.rangeMin &&
      this.correctValue <= this.rangeMax;
  }

  /**
   * Gets the validation error reason from the question and all included answerOptions as a stackable array
   * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
   */
  getValidationStackTrace(): Array<IValidationStackTrace> {
    const parentStackTrace = super.getValidationStackTrace();
    const hasValidRange = this.rangeMin < this.rangeMax;
    const hasValidCorrectValue = this.correctValue >= this.rangeMin && this.correctValue <= this.rangeMax;
    if (!hasValidRange) {
      parentStackTrace.push({occurredAt: {type: 'question'}, reason: 'invalid_range'});
    }
    if (!hasValidCorrectValue) {
      parentStackTrace.push({occurredAt: {type: 'question'}, reason: 'invalid_correct_value'});
    }
    return parentStackTrace;
  }

  /**
   * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
   * @see AbstractQuestion.equals()
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {QuestionI} question The Question instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  equals(question: IQuestionRanged): boolean {
    return super.equals(question) && question.rangeMax === this.rangeMax && question.rangeMin === this.rangeMin && question.correctValue === this.correctValue;
  }

  translationReferrer(): string {
    return 'component.questions.ranged_question';
  }

  translationDescription(): string {
    return 'component.question_type.description.RangedQuestion';
  }
}
