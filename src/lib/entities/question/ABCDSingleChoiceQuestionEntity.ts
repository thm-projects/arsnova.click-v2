import { QuestionType } from '../../enums/QuestionType';
import { DefaultAnswerEntity } from '../answer/DefaultAnswerEntity';
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
    this.answerOptionList.splice(this.answerOptionList.length - 1, 1);
  }

  public addDefaultAnswerOption(): void {
    this.addAnswerOption(new DefaultAnswerEntity({
      answerText: String.fromCharCode(65 + this.answerOptionList.length),
      isCorrect: false,
    }));
  }

}
