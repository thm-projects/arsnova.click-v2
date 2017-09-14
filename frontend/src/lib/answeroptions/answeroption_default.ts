import {AbstractAnswerOption} from './answeroption_abstract';
import {AnswerOptionI} from "./AnswerOptionI";

export class DefaultAnswerOption extends AbstractAnswerOption implements AnswerOptionI{
  readonly TYPE: string = 'DefaultAnswerOption';

	constructor ({answerText, isCorrect = false}: {answerText?: string, isCorrect?: boolean}) {
		super({answerText, isCorrect});
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag: String, type: String, questionIndex: Number, answerText: String, answerOptionNumber: Number, isCorrect: Boolean}}
	 */
	serialize (): any {
		return Object.assign(super.serialize(), {
			type: this.TYPE
		});
	}
}
