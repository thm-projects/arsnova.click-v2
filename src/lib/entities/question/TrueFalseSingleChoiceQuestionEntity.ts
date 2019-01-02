import { QuestionType } from '../../enums/QuestionType';
import { SingleChoiceQuestionEntity } from './SingleChoiceQuestionEntity';

export class TrueFalseSingleChoiceQuestionEntity extends SingleChoiceQuestionEntity {
  public TYPE = QuestionType.TrueFalseSingleChoiceQuestion;

  constructor(props) {
    super(props);
  }

  public translationReferrer(): string {
    return 'component.questions.single_choice_question_true_false';
  }

  public translationDescription(): string {
    return 'component.question_type.description.TrueFalseSingleChoiceQuestion';
  }

  public removeAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

  public addDefaultAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

}
