import { QuestionType } from '../../enums/QuestionType';
import { DefaultAnswerEntity } from '../answer/DefaultAnswerEntity';
import { SurveyQuestionEntity } from './SurveyQuestionEntity';

export class ABCDSurveyQuestionEntity extends SurveyQuestionEntity {
  public TYPE = QuestionType.ABCDSurveyQuestion;

  constructor(props) {
    super(props);
    this.requiredForToken = false;
    this.answerOptionList.forEach(answer => answer.isCorrect = false);
  }

  public isValid(): boolean {
    return true;
  }

  public translationReferrer(): string {
    return 'component.questions.survey_question_abcd';
  }

  public translationDescription(): string {
    return 'component.question_type.description.ABCDSurveyQuestion';
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
