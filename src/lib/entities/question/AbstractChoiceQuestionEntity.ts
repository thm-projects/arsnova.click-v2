import { DefaultSettings } from '../../default.settings';
import { AbstractQuestionEntity } from './AbstractQuestionEntity';

export abstract class AbstractChoiceQuestionEntity extends AbstractQuestionEntity {
  public showOneAnswerPerRow: boolean = DefaultSettings.defaultQuizSettings.question.showOneAnswerPerRow;

  protected constructor(props) {
    super(props);
    this.showOneAnswerPerRow = props.showOneAnswerPerRow ? props.showOneAnswerPerRow : this.showOneAnswerPerRow;
  }

  public isParentValid(): boolean {
    return super.isValid();
  }
}
