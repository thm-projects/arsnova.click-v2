import {AbstractChoiceQuestion} from './question_choice_abstract';
import {QuestionChoiceI} from "./QuestionChoiceI";
import {ValidationStackTraceI} from "./QuestionI";

export class MultipleChoiceQuestion extends AbstractChoiceQuestion implements QuestionChoiceI {

  canEditQuestionText: boolean = true;
  canEditAnsweroptions: boolean = true;
  canEditQuestionTimer: boolean = true;
  canEditQuestionType: boolean = true;

  canAddAnsweroptions: boolean = true;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsDefaultComponent';

  public TYPE = 'MultipleChoiceQuestion';

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

	translationReferrer (): string {
		return "component.questions.multiple_choice_question";
	}

  translationDescription (): string {
    return "component.question_type.description.MultipleChoiceQuestion";
  }

	/**
	 * Gets the validation error reason from the question and all included answerOptions as a stackable array
	 * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
	 */
	getValidationStackTrace (): Array<ValidationStackTraceI> {
		const parentStackTrace = super.getValidationStackTrace();
		let hasValidAnswer = false;
		this.answerOptionList.forEach(function (answeroption) {
			if (answeroption.isCorrect) {
				hasValidAnswer = true;
			}
		});
		if (!hasValidAnswer) {
			parentStackTrace.push({occurredAt: {type: "question"}, reason: "no_valid_answers"});
		}
		return parentStackTrace;
	}
}

