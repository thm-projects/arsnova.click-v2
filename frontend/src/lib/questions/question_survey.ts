import {AbstractChoiceQuestion} from './question_choice_abstract';
import {IQuestionSurvey, IValidationStackTrace} from './interfaces';
import {DefaultAnswerOption} from '../answeroptions/answeroption_default';

export class SurveyQuestion extends AbstractChoiceQuestion implements IQuestionSurvey {

  canEditQuestionText = true;
  canEditAnsweroptions = true;
  canEditQuestionTimer = true;
  canEditQuestionType = true;

  canAddAnsweroptions = true;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  get multipleSelectionEnabled(): boolean {
    return this._multipleSelectionEnabled;
  }

  set multipleSelectionEnabled(value: boolean) {
    this._multipleSelectionEnabled = value;
  }

  public TYPE = 'SurveyQuestion';
  private _multipleSelectionEnabled: boolean;

  /**
   * Constructs a RangedQuestion instance
   * @see AbstractQuestion.constructor()
   * @param options
   */
  constructor({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow, multipleSelectionEnabled}) {
    super({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow});
    this._multipleSelectionEnabled = multipleSelectionEnabled;
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid(). Checks if the Question has exactly zero correct AnswerOptions
   * @see AbstractQuestion.isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    return super.isParentValid();
  }

  /**
   * Gets the validation error reason from the question and all included answerOptions as a stackable array
   * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
   */
  getValidationStackTrace(): Array<IValidationStackTrace> {
    return super.getValidationStackTrace();
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {
      TYPE: this.TYPE,
      multipleSelectionEnabled: this.multipleSelectionEnabled
    });
  }

  equals(question: IQuestionSurvey): boolean {
    return super.equals(question) &&
           question.multipleSelectionEnabled === this.multipleSelectionEnabled;
  }

  translationReferrer(): string {
    return 'component.questions.survey_question';
  }

  translationDescription(): string {
    return 'component.question_type.description.SurveyQuestion';
  }

  addDefaultAnswerOption(index?: number): void {
    if (index === -1 || index >= this.answerOptionList.length) {
      index = this.answerOptionList.length;
    }
    this.addAnswerOption(
      new DefaultAnswerOption({
        answerText: ''
      }),
      index
    );
  }
}
