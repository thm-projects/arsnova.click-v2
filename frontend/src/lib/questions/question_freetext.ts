import {AbstractQuestion} from './question_abstract';
import {IQuestionFreetext} from './interfaces';
import {FreeTextAnswerOption} from '../answeroptions/answeroption_freetext';
import {IFreetextAnswerOption} from '../answeroptions/interfaces';

export class FreeTextQuestion extends AbstractQuestion implements IQuestionFreetext {

  canEditQuestionText = true;
  canEditAnsweroptions = true;
  canEditQuestionTimer = true;
  canEditQuestionType = true;

  canAddAnsweroptions = false;

  readonly preferredAnsweroptionComponent: string = 'AnsweroptionsFreetextComponent';

  public TYPE = 'FreeTextQuestion';

  /**
   * Constructs a FreeTextQuestion instance
   * @see AbstractQuestion.constructor()
   * @param options @see AbstractQuestion.constructor().options
   */
  constructor({questionText, timer, answerOptionList}) {
    super({questionText, timer, answerOptionList});
  }

  /**
   * Serialized the instance object to a JSON compatible object
   * @see AbstractQuestion.serialize()
   * @returns {{hashtag, questionText, type, timer, startTime, questionIndex, answerOptionList}|{hashtag: String, questionText: String,
   *     type: AbstractQuestion, timer: Number, startTime: Number, questionIndex: Number, answerOptionList: Array}}
   */
  serialize(): Object {
    return Object.assign(super.serialize(), {
      TYPE: this.TYPE
    });
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
   * and summarizes their result of calling .isValid().
   * @see AbstractQuestion.isValid()
   * @returns {boolean} True, if the complete Question instance is valid, False otherwise
   */
  isValid(): boolean {
    return super.isValid() &&
           this.answerOptionList.length === 1 &&
           this.answerOptionList[0].isValid();
  }

  addAnswerOption(answerOption: IFreetextAnswerOption): void {
    super.addAnswerOption(answerOption, 0);
  }

  /**
   * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
   * @see AbstractQuestion.equals()
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {FreeTextQuestion} question The Question instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  equals(question): boolean {
    return super.equals(question);
  }

  translationReferrer(): string {
    return 'component.questions.free_text_question';
  }

  translationDescription(): string {
    return 'component.question_type.description.FreeTextQuestion';
  }

  /**
   * Quick way to insert a default AnswerOption to the Question instance.
   */
  addDefaultAnswerOption(): void {
    if (this.answerOptionList.length > 0) {
      return;
    }
    this.addAnswerOption(
      new FreeTextAnswerOption({
                                 answerText: '',
                                 configCaseSensitive: false,
                                 configTrimWhitespaces: false,
                                 configUseKeywords: true,
                                 configUsePunctuation: false
                               })
    );
  }
}
