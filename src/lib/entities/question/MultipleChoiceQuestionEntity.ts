import { QuestionType } from '../../enums/QuestionType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';
import { AbstractChoiceQuestionEntity } from './AbstractChoiceQuestionEntity';

export class MultipleChoiceQuestionEntity extends AbstractChoiceQuestionEntity {
  public TYPE = QuestionType.MultipleChoiceQuestion;

  constructor(props) {
    super(props);
  }

  public translationReferrer(): string {
    return 'component.questions.multiple_choice_question';
  }

  public translationDescription(): string {
    return 'component.question_type.description.MultipleChoiceQuestion';
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    const parentStackTrace = super.getValidationStackTrace();
    let hasValidAnswer = false;
    this.answerOptionList.forEach(answeroption => {
      if (answeroption.isCorrect) {
        hasValidAnswer = true;
      }
    });
    if (!hasValidAnswer) {
      parentStackTrace.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.no_valid_answers',
      });
    }
    return parentStackTrace;
  }
}

