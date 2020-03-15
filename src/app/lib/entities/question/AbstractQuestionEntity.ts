import { CloudData } from 'angular-tag-cloud-module';
import { getAnswerForType } from '../../AnswerValidator';
import { DefaultSettings } from '../../default.settings';
import { AnswerType } from '../../enums/AnswerType';
import { QuestionType } from '../../enums/QuestionType';
import { IValidationStackTrace } from '../../interfaces/IValidationStackTrace';
import { AbstractAnswerEntity } from '../answer/AbstractAnswerEntity';
import { DefaultAnswerEntity } from '../answer/DefaultAnswerEntity';

export abstract class AbstractQuestionEntity {
  public questionText: string = DefaultSettings.defaultQuizSettings.question.questionText;
  public timer: number = DefaultSettings.defaultQuizSettings.question.timer;
  public displayAnswerText: boolean = DefaultSettings.defaultQuizSettings.question.dispayAnswerText;
  public answerOptionList: Array<AbstractAnswerEntity> = DefaultSettings.defaultQuizSettings.question.answerOptionList;
  public tags: Array<string> = DefaultSettings.defaultQuizSettings.question.tags;
  public abstract TYPE: QuestionType;

  protected constructor(data) {
    this.questionText = data.questionText ? data.questionText : this.questionText;
    this.timer = typeof data.timer === 'number' ? data.timer : parseInt(data.timer ?? this.timer, 10);
    this.displayAnswerText = data.displayAnswerText ?? this.displayAnswerText;
    this.tags = data.tags ?? [];

    if (data.answerOptionList) {
      if (data.TYPE === QuestionType.FreeTextQuestion) {
        this.answerOptionList = data.answerOptionList.map(answer => {
          if (answer.TYPE === AnswerType.FreeTextAnswerOption) {
            return getAnswerForType(answer.TYPE, answer);
          }
          return getAnswerForType(AnswerType.FreeTextAnswerOption, {});
        });
      } else if (data.TYPE === QuestionType.RangedQuestion) {
        this.answerOptionList = [];
      } else {
        this.answerOptionList = data.answerOptionList.map(answer => {
          if (answer.TYPE === AnswerType.DefaultAnswerOption) {
            return getAnswerForType(answer.TYPE, answer);
          }
          return getAnswerForType(AnswerType.DefaultAnswerOption, {});
        });
      }
    }
  }

  public abstract translationReferrer(): string;

  public isValid(): boolean {
    let answerOptionListValid = true;
    this.answerOptionList.forEach(answerOption => {
      if (!answerOption.isValid()) {
        answerOptionListValid = false;
      }
    });
    const questionTextWithoutMarkdownChars = this.getQuestionTextWithoutMarkdownChars().length;

    // hard coded checkup values are ugly, but the schema import seems to be messed up here...
    return answerOptionListValid && questionTextWithoutMarkdownChars > 4 && questionTextWithoutMarkdownChars < 50001 && this.timer >= -1;
  }

  public getQuestionTextWithoutMarkdownChars(): string {
    return this.questionText.replace(/#/g, '').replace(/\*/g, '').replace(/1./g, '').replace(/\[/g, '').replace(/\]\(/g, '')
    .replace(/\)/g, '').replace(/- /g, '').replace(/ /g, '').replace(/\\\(/g, '').replace(/\\\)/g, '').replace(/$/g, '')
    .replace(/<hlcode>/g, '').replace(/<\/hlcode>/g, '').replace(/>/g, '');
  }

  public getValidationStackTrace(): Array<IValidationStackTrace> {
    let result = Array<IValidationStackTrace>();
    const questionTextWithoutMarkdownChars = this.getQuestionTextWithoutMarkdownChars().length;
    if (questionTextWithoutMarkdownChars < 5) {
      result.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.question_text_too_small',
      });
    } else if (questionTextWithoutMarkdownChars > 50000) {
      result.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.question_text_too_long',
      });
    }
    if (this.timer < -1) {
      result.push({
        occurredAt: { type: 'question' },
        reason: 'component.quiz_summary.validation_errors.reasons.timer_too_small',
      });
    }
    this.answerOptionList.forEach(answerOption => {
      if (!answerOption.isValid()) {
        result = result.concat(answerOption.getValidationStackTrace());
      }
    });
    return result;
  }

  public equals(question: AbstractQuestionEntity): boolean {
    const questionAnswerOptionList = question.answerOptionList;
    if (questionAnswerOptionList.length === this.answerOptionList.length) {
      let isEqual = true;
      for (let i = 0; i < this.answerOptionList.length; i++) {
        if (isEqual && !this.answerOptionList[i].equals(questionAnswerOptionList[i])) {
          isEqual = false;
        }
      }
      if (question.timer !== this.timer || question.questionText !== this.questionText) {
        isEqual = false;
      }
      return isEqual;
    }
  }

  public addDefaultAnswerOption(index = -1): void {
    if (index === -1 || index >= this.answerOptionList.length) {
      index = this.answerOptionList.length;
    }
    this.addAnswerOption(new DefaultAnswerEntity({
      answerText: '',
      isCorrect: false,
    }), index);
  }

  public addAnswerOption(answerOption: AbstractAnswerEntity, index: number = -1): void {
    if (index < 0 || index >= this.answerOptionList.length) {
      this.answerOptionList.push(answerOption);
    } else {
      this.answerOptionList.splice(index, 0, answerOption);
    }
  }

  public removeAnswerOption(index: number): void {
    if (index < 0 || index > this.answerOptionList.length) {
      throw new Error('Invalid argument for Question.removeAnswerOption');
    }
    this.answerOptionList.splice(index, 1);
  }

  public removeAllAnswerOptions(): void {
    this.answerOptionList.splice(0, this.answerOptionList.length);
  }
}
