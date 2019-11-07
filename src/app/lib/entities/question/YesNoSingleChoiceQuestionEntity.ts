import { QuestionType } from '../../enums/QuestionType';
import { SingleChoiceQuestionEntity } from './SingleChoiceQuestionEntity';

export class YesNoSingleChoiceQuestionEntity extends SingleChoiceQuestionEntity {
  public TYPE = QuestionType.YesNoSingleChoiceQuestion;

  constructor(props) {
    super(props);
  }

  public translationReferrer(): string {
    return 'component.questions.single_choice_question_yes_no';
  }

  public translationDescription(): string {
    return 'component.question_type.description.YesNoSingleChoiceQuestion';
  }

  public removeAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }

  public addDefaultAnswerOption(): void {
    throw Error('AnswerOptions cannot be modified for this type of Question!');
  }
}
