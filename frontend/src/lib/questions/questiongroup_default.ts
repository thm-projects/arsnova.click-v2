import {AbstractQuestionGroup} from './questiongroup_abstract';
import {SessionConfiguration} from '../session_configuration/session_config';
import {questionReflection} from './question_reflection';
import {AbstractQuestion} from './question_abstract';
import {IQuestionGroup} from './interfaces';
import {ISessionConfiguration} from '../session_configuration/interfaces';

export class DefaultQuestionGroup extends AbstractQuestionGroup implements IQuestionGroup {

  public TYPE = 'DefaultQuestionGroup';

  constructor({
                hashtag,
                questionList = [],
                isFirstStart = true,
                sessionConfig = new SessionConfiguration(null)}:
                { hashtag: string,
                  questionList?: Array<string>,
                  isFirstStart?: boolean,
                  sessionConfig?: ISessionConfiguration }) {
    super({hashtag, questionList, isFirstStart, sessionConfig});
    if (this.questionList.length > 0) {
      this.questionList.forEach(function (question: any, index: number) {
        if (!(question instanceof AbstractQuestion)) {
          this.questionList[index] = questionReflection[question.TYPE](question);
        }
      }, this);
    }
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag: String, type: String, questionList: Array}}
   */
  serialize(): any {
    return Object.assign(super.serialize(), {TYPE: this.TYPE});
  }
}
