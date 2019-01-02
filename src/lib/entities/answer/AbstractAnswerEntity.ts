import { DefaultSettings } from '../../default.settings';
import { AnswerType } from '../../enums/AnswerType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';

export abstract class AbstractAnswerEntity {
  public abstract TYPE: AnswerType;
  public answerText: string = DefaultSettings.defaultQuizSettings.answers.answerText;
  public isCorrect: boolean = DefaultSettings.defaultQuizSettings.answers.isCorrect;

  protected constructor(props) {
    this.answerText = props.answerText ? props.answerText : this.answerText;
    this.isCorrect = typeof props.isCorrect !== 'undefined' ? props.isCorrect : this.isCorrect;
  }

  public getAnswerTextLengthWithoutMarkdownChars(): number {
    let tmpValue = this.answerText;
    tmpValue = tmpValue.replace(/#/g, '');
    tmpValue = tmpValue.replace(/\*/g, '');
    tmpValue = tmpValue.replace(/1./g, '');
    tmpValue = tmpValue.replace(/\[/g, '');
    tmpValue = tmpValue.replace(/\]\(/g, '');
    tmpValue = tmpValue.replace(/\)/g, '');
    tmpValue = tmpValue.replace(/- /g, '');
    tmpValue = tmpValue.replace(/\\\(/g, '');
    tmpValue = tmpValue.replace(/\\\)/g, '');
    tmpValue = tmpValue.replace(/$/g, '');
    tmpValue = tmpValue.replace(/<hlcode>/g, '');
    tmpValue = tmpValue.replace(/<\/hlcode>/g, '');
    tmpValue = tmpValue.replace(/>/g, '');
    return tmpValue.length;
  }

  public isValid(): boolean {
    return this.answerText.replace(/ /g, '').length > 0;
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    return (this.answerText.length === 0) ? [
      {
        occurredAt: { type: 'answerOption' },
        reason: 'answer_text_empty',
      },
    ] : [];
  }

  public equals(answerOption: AbstractAnswerEntity): boolean {
    return answerOption.answerText === this.answerText && answerOption.isCorrect === this.isCorrect;
  }

}
