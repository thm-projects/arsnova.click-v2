import {SingleChoiceQuestion} from './question_choice_single';
import {IQuestionChoice} from './interfaces';

export class YesNoSingleChoiceQuestion extends SingleChoiceQuestion implements IQuestionChoice {

  canEditQuestionText = true;
  canEditAnsweroptions = true;
  canEditQuestionTimer = true;
  canEditQuestionType = true;

  canAddAnsweroptions = false;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  public TYPE = 'YesNoSingleChoiceQuestion';

  /**
   * Constructs a YesNoSingleChoiceQuestion instance
   * @see AbstractChoiceQuestion.constructor()
   * @param options
   */
  constructor(options) {
    super(options);
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {TYPE: this.TYPE});
  }

  translationReferrer(): string {
    return 'component.questions.single_choice_question_yes_no';
  }

  translationDescription(): string {
    return 'component.question_type.description.YesNoSingleChoiceQuestion';
  }

  removeAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

  addDefaultAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }
}
