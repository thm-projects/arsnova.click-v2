import {AbstractChoiceQuestion} from './question_choice_abstract';
import {QuestionChoiceI} from "./QuestionChoiceI";
import {ValidationStackTraceI} from "./QuestionI";

export class SingleChoiceQuestion extends AbstractChoiceQuestion implements QuestionChoiceI {

  canEditQuestionText: boolean = true;
  canEditAnsweroptions: boolean = true;
  canEditQuestionTimer: boolean = true;
  canEditQuestionType: boolean = true;

  canAddAnsweroptions: boolean = true;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  public TYPE = 'SingleChoiceQuestion';

	/**
	 * Constructs a SingleChoiceQuestion instance
	 * @see AbstractChoiceQuestion.constructor()
	 * @param options
	 */
	constructor ({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow}: any) {
    super({questionText, timer, displayAnswerText, answerOptionList, showOneAnswerPerRow});
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
	 */
	serialize (): Object {
		return Object.assign(super.serialize(), {type: this.TYPE});
	}

	/**
	 * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
	 * and summarizes their result of calling .isValid(). Checks also if this Question instance contains exactly one correct AnswerOption
	 * @see AbstractChoiceQuestion.isValid()
	 * @returns {boolean} True, if the complete Question instance is valid, False otherwise
	 */
	isValid (): boolean {
		let hasValidAnswer = 0;
		this.answerOptionList.forEach(function (answeroption) {
			if (answeroption.isCorrect) {
				hasValidAnswer++;
			}
		});
		return super.isValid() && hasValidAnswer === 1;
	}

	/**
	 * Gets the validation error reason from the question and all included answerOptions as a stackable array
	 * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
	 */
	getValidationStackTrace (): Array<ValidationStackTraceI> {
		let hasValidAnswer = 0;
		this.answerOptionList.forEach(function (answeroption) {
			if (answeroption.isCorrect) {
				hasValidAnswer++;
			}
		});
		const parentStackTrace = super.getValidationStackTrace();
		if (hasValidAnswer !== 1) {
			parentStackTrace.push({occurredAt: {type: "question"}, reason: "one_valid_answer_required"});
		}
		return parentStackTrace;
	}

	translationReferrer (): string {
		return "component.questions.single_choice_question";
	}

  translationDescription (): string {
	  return "component.question_type.description.SingleChoiceQuestion";
  }
}
