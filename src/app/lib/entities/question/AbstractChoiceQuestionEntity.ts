import { getAnswerForType } from '../../AnswerValidator';
import { DefaultSettings } from '../../default.settings';
import { AnswerType } from '../../enums/AnswerType';
import { AbstractQuestionEntity } from './AbstractQuestionEntity';

export abstract class AbstractChoiceQuestionEntity extends AbstractQuestionEntity {
  public showOneAnswerPerRow: boolean = DefaultSettings.defaultQuizSettings.question.showOneAnswerPerRow;

  protected constructor(props) {
    super(props);

    this.showOneAnswerPerRow = props.showOneAnswerPerRow ? props.showOneAnswerPerRow : this.showOneAnswerPerRow;
    this.answerOptionList = this.answerOptionList.map(answer => {
      return getAnswerForType(AnswerType.DefaultAnswerOption, answer);
    });
  }

  public isParentValid(): boolean {
    return super.isValid();
  }
}
