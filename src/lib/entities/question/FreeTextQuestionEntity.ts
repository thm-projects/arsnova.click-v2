import { QuestionType } from '../../enums/QuestionType';
import { FreeTextAnswerEntity } from '../answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from './AbstractQuestionEntity';

export class FreeTextQuestionEntity extends AbstractQuestionEntity {
  public TYPE = QuestionType.FreeTextQuestion;

  constructor(props) {
    super(props);
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid().
   * @see AbstractQuestion.isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  public isValid(): boolean {
    return super.isValid() && this.answerOptionList.length === 1 && this.answerOptionList[0].isValid();
  }

  public addAnswerOption(answerOption: FreeTextAnswerEntity): void {
    super.addAnswerOption(answerOption, 0);
  }

  /**
   * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
   * @see AbstractQuestion.equals()
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {FreeTextQuestion} question The Question instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  public equals(question): boolean {
    return super.equals(question);
  }

  public translationReferrer(): string {
    return 'component.questions.free_text_question';
  }

  public translationDescription(): string {
    return 'component.question_type.description.FreeTextQuestion';
  }

  /**
   * Quick way to insert a default AnswerOption to the Question instance.
   */
  public addDefaultAnswerOption(): void {
    if (this.answerOptionList.length > 0) {
      return;
    }
    this.addAnswerOption(new FreeTextAnswerEntity({
      answerText: '',
      configCaseSensitive: false,
      configTrimWhitespaces: false,
      configUseKeywords: true,
      configUsePunctuation: false,
    }));
  }
}
