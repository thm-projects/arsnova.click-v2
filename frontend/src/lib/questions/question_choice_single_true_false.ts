import {SingleChoiceQuestion} from './question_choice_single';
import {QuestionChoiceI} from "./QuestionChoiceI";

export class TrueFalseSingleChoiceQuestion extends SingleChoiceQuestion implements QuestionChoiceI {

  canEditQuestionText: boolean = true;
  canEditAnsweroptions: boolean = true;
  canEditQuestionTimer: boolean = true;
  canEditQuestionType: boolean = true;

  canAddAnsweroptions: boolean = false;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  public TYPE = 'TrueFalseSingleChoiceQuestion';

	/**
	 * Constructs a TrueFalseSingleChoiceQuestion instance
	 * @see AbstractChoiceQuestion.constructor()
	 * @param options
	 */
	constructor (options) {
		super(options);
	}

	clone (): TrueFalseSingleChoiceQuestion {
		return new TrueFalseSingleChoiceQuestion(this.serialize());
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
	 */
	serialize (): Object {
		return Object.assign(super.serialize(), {type: this.TYPE});
	}

	translationReferrer (): string {
		return "component.questions.single_choice_question_true_false";
	}

  translationDescription (): string {
    return "component.question_type.description.TrueFalseSingleChoiceQuestion";
  }

	removeAnswerOption (): void {
		throw Error("AnswerOptions cannot be modified for this type of Question!");
	}

	addDefaultAnswerOption (): void {
		throw Error("AnswerOptions cannot be modified for this type of Question!");
	}
}
