import { AnswerType } from '../../enums/AnswerType';
import { AbstractAnswerEntity } from './AbstractAnswerEntity';

export class DefaultAnswerEntity extends AbstractAnswerEntity {
  public readonly TYPE = AnswerType.DefaultAnswerOption;

  constructor(props) {
    super(props);
  }
}
