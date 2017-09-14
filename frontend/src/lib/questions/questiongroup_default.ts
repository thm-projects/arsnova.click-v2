import {AbstractQuestionGroup} from './questiongroup_abstract';
import {SessionConfiguration} from "../session_configuration/session_config";
import {questionReflection} from "./question_reflection";
import {AbstractQuestion} from "./question_abstract";

export class DefaultQuestionGroup extends AbstractQuestionGroup{

  public TYPE: string = 'DefaultQuestionGroup';

	constructor ({hashtag, questionList = [], isFirstStart = true, sessionConfig = new SessionConfiguration({})}) {
		super({hashtag, questionList, isFirstStart, sessionConfig});
		const self = this;
    if (this.questionList.length > 0) {
      this.questionList.forEach(function (question: any, index: number) {
        if (!(question instanceof AbstractQuestion)) {
          this.questionList[index] = questionReflection[question.type](question);
        }
      }, this);
    }
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag: String, type: String, questionList: Array}}
	 */
	serialize(): any {
		return Object.assign(super.serialize(), {type: this.TYPE});
	}
}
