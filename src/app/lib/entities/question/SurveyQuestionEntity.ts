import { DefaultSettings } from '../../default.settings';
import { QuestionType } from '../../enums/QuestionType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';
import { DefaultAnswerEntity } from '../answer/DefaultAnswerEntity';
import { AbstractChoiceQuestionEntity } from './AbstractChoiceQuestionEntity';

export class SurveyQuestionEntity extends AbstractChoiceQuestionEntity {
  public TYPE = QuestionType.SurveyQuestion;
  public multipleSelectionEnabled: boolean = DefaultSettings.defaultQuizSettings.question.multipleSelectionEnabled;

  constructor(props) {
    super(props);
    this.multipleSelectionEnabled = props.multipleSelectionEnabled;
    this.answerOptionList.forEach(answer => answer.isCorrect = false);
    this.requiredForToken = false;
  }

  public isValid(): boolean {
    const correctAnswers = this.answerOptionList.filter(answeroption => answeroption.isCorrect).length;
    return super.isValid() && correctAnswers === 0;
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    return super.getValidationStackTrace();
  }

  public equals(question: SurveyQuestionEntity): boolean {
    return super.equals(question) && question.multipleSelectionEnabled === this.multipleSelectionEnabled;
  }

  public translationReferrer(): string {
    return 'component.questions.survey_question';
  }

  public translationDescription(): string {
    return 'component.question_type.description.SurveyQuestion';
  }

  public addDefaultAnswerOption(index?: number): void {
    if (index === -1 || index >= this.answerOptionList.length) {
      index = this.answerOptionList.length;
    }
    this.addAnswerOption(new DefaultAnswerEntity({
      answerText: '',
    }), index);
  }
}
