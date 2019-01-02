import { QuestionType } from '../../enums/QuestionType';
import { SingleChoiceQuestionEntity } from './SingleChoiceQuestionEntity';

export class ABCDSingleChoiceQuestionEntity extends SingleChoiceQuestionEntity {
  public TYPE = QuestionType.ABCDSingleChoiceQuestion;

  constructor(props) {
    super(props);
  }

  public isValid(): boolean {
    return true;
  }

  public translationReferrer(): string {
    return 'component.questions.single_choice_question_abcd';
  }

  public translationDescription(): string {
    return 'component.question_type.description.AbcdSingleChoiceQuestion';
  }

  public removeAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

  public addDefaultAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

}
