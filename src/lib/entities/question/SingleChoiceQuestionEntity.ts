import { QuestionType } from '../../enums/QuestionType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';
import { AbstractChoiceQuestionEntity } from './AbstractChoiceQuestionEntity';

export class SingleChoiceQuestionEntity extends AbstractChoiceQuestionEntity {
  public TYPE = QuestionType.SingleChoiceQuestion;

  constructor(props) {
    super(props);
  }

  public isValid(): boolean {
    const hasValidAnswer = this.answerOptionList.filter(answeroption => answeroption.isCorrect).length;
    return super.isValid() && hasValidAnswer === 1;
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    let hasValidAnswer = 0;
    this.answerOptionList.forEach(answeroption => {
      if (answeroption.isCorrect) {
        hasValidAnswer++;
      }
    });
    const parentStackTrace = super.getValidationStackTrace();
    if (hasValidAnswer !== 1) {
      parentStackTrace.push({
        occurredAt: { type: 'question' },
        reason: 'one_valid_answer_required',
      });
    }
    return parentStackTrace;
  }

  public translationReferrer(): string {
    return 'component.questions.single_choice_question';
  }

  public translationDescription(): string {
    return 'component.question_type.description.SingleChoiceQuestion';
  }

}
