import { DefaultSettings } from '../../default.settings';
import { QuestionType } from '../../enums/QuestionType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';
import { AbstractQuestionEntity } from './AbstractQuestionEntity';

export class RangedQuestionEntity extends AbstractQuestionEntity {
  public TYPE = QuestionType.RangedQuestion;
  public rangeMin = DefaultSettings.defaultQuizSettings.question.rangeMin;
  public rangeMax = DefaultSettings.defaultQuizSettings.question.rangeMax;
  public correctValue = DefaultSettings.defaultQuizSettings.question.correctValue;

  constructor(props) {
    super(props);
    this.rangeMax = props.rangeMax;
    this.rangeMin = props.rangeMin;
    this.correctValue = props.correctValue;
    this.answerOptionList = [];
  }

  public isValid(): boolean {
    return super.isValid() && //
           this.answerOptionList.length === 0 && //
           this.rangeMin < this.rangeMax && //
           this.correctValue >= this.rangeMin && //
           this.correctValue <= this.rangeMax;
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    const parentStackTrace = super.getValidationStackTrace();
    const hasValidRange = this.rangeMin < this.rangeMax;
    const hasValidCorrectValue = this.correctValue >= this.rangeMin && this.correctValue <= this.rangeMax;
    if (!hasValidRange) {
      parentStackTrace.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.invalid_range',
      });
    }
    if (!hasValidCorrectValue) {
      parentStackTrace.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.invalid_correct_value',
      });
    }
    return parentStackTrace;
  }

  public equals(question: RangedQuestionEntity): boolean {
    return super.equals(question) && //
           question.rangeMax === this.rangeMax && //
           question.rangeMin === this.rangeMin && //
           question.correctValue === this.correctValue;
  }

  public translationReferrer(): string {
    return 'component.questions.ranged_question';
  }

  public translationDescription(): string {
    return 'component.question_type.description.RangedQuestion';
  }
}
