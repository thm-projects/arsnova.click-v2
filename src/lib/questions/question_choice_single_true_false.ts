import {SingleChoiceQuestion} from './question_choice_single';
import {IQuestionChoice} from './interfaces';
import {DefaultAnswerOption} from '../answeroptions/answeroption_default';

export class TrueFalseSingleChoiceQuestion extends SingleChoiceQuestion implements IQuestionChoice {

  canEditQuestionText = true;
  canEditAnsweroptions = true;
  canEditQuestionTimer = true;
  canEditQuestionType = true;

  canAddAnsweroptions = false;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  public TYPE = 'TrueFalseSingleChoiceQuestion';

  /**
   * Constructs a TrueFalseSingleChoiceQuestion instance
   * @see AbstractChoiceQuestion.constructor()
   * @param options
   */
  constructor(options) {
    super(options);
    if (!options.answerOptionList.length) {
      this.answerOptionList = [
        new DefaultAnswerOption({answerText: '', isCorrect: true}),
        new DefaultAnswerOption({answerText: '', isCorrect: false}),
      ];
    }
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {TYPE: this.TYPE});
  }

  translationReferrer(): string {
    return 'component.questions.single_choice_question_true_false';
  }

  translationDescription(): string {
    return 'component.question_type.description.TrueFalseSingleChoiceQuestion';
  }

  removeAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

  addDefaultAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }
}
