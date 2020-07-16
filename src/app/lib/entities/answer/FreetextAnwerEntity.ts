import { DefaultSettings } from '../../default.settings';
import { AnswerType } from '../../enums/AnswerType';
import { IFreetextAnswerConfiguration } from '../../interfaces/answeroptions/IFreetextAnswerConfiguration';
import { AbstractAnswerEntity } from './AbstractAnswerEntity';

export class FreeTextAnswerEntity extends AbstractAnswerEntity {
  public readonly TYPE = AnswerType.FreeTextAnswerOption;

  public configCaseSensitive: boolean = DefaultSettings.defaultQuizSettings.answers.configCaseSensitive;
  public configTrimWhitespaces: boolean = DefaultSettings.defaultQuizSettings.answers.configTrimWhitespaces;
  public configUseKeywords: boolean = DefaultSettings.defaultQuizSettings.answers.configUseKeywords;
  public configUsePunctuation: boolean = DefaultSettings.defaultQuizSettings.answers.configUsePunctuation;

  constructor(props) {
    super(props);

    this.configCaseSensitive = props.configCaseSensitive ?? this.configCaseSensitive;
    this.configTrimWhitespaces = props.configTrimWhitespaces ?? this.configTrimWhitespaces;
    this.configUseKeywords = props.configUseKeywords ?? this.configUseKeywords;
    this.configUsePunctuation = props.configUsePunctuation ?? this.configUsePunctuation;
  }

  public isCorrectInput(ref: string): boolean {
    if (!ref) {
      return false;
    }

    let refValue = this.answerText;
    let result = false;
    if (!this.configCaseSensitive) {
      refValue = refValue.toLowerCase();
      ref = ref.toLowerCase();
      result = refValue === ref;
    }
    if (this.configTrimWhitespaces) {
      refValue = refValue.replace(/[ ]/g, '');
      ref = ref.replace(/[ ]/g, '');
      result = refValue === ref;
    } else {
      refValue = refValue.replace(/[-]/g, ' ');
      ref = ref.replace(/[-]/g, ' ');

      if (!this.configUsePunctuation) {
        refValue = refValue.replace(/[,:\(\)\[\]\.\*\?]/g, '');
        ref = ref.replace(/[,:\(\)\[\]\.\*\?]/g, '');
      }

      const revValueSplitted = refValue.split(/[ ]/);
      const revSplitted = ref.split(/[ ]/);
      if (this.configUseKeywords) {
        result = revSplitted.length === revValueSplitted.length &&
                 revSplitted.every((elem, index) => revValueSplitted[index] === elem);
      } else {
        result = revSplitted.length === revValueSplitted.length &&
                 revSplitted.every((elem) => revValueSplitted.includes(elem));
      }
    }
    return result;
  }

  public setConfig(configIdentifier: string, configValue: boolean): void {
    switch (configIdentifier) {
      case 'config_case_sensitive_switch':
        this.configCaseSensitive = configValue;
        break;
      case 'config_trim_whitespaces_switch':
        this.configTrimWhitespaces = configValue;
        this.configUseKeywords = false;
        this.configUsePunctuation = false;
        break;
      case 'config_use_keywords_switch':
        this.configUseKeywords = configValue;
        break;
      case 'config_use_punctuation_switch':
        this.configUsePunctuation = configValue;
        break;
      default:
        throw Error('Config not found');
    }
  }

  public getConfig(): Array<IFreetextAnswerConfiguration> {
    return [
      {
        configTitle: 'component.answeroptions.free_text_question.config_case_sensitive',
        configEnabledString: 'component.answeroptions.free_text_question.' + (
          this.configCaseSensitive ? 'onText' : 'offText'
        ),
        enabled: this.configCaseSensitive,
        disabled: () => false,
        id: 'config_case_sensitive_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_trim_whitespaces',
        configEnabledString: 'component.answeroptions.free_text_question.' + (
          this.configTrimWhitespaces ? 'onText' : 'offText'
        ),
        enabled: this.configTrimWhitespaces,
        disabled: () => false,
        id: 'config_trim_whitespaces_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_use_keywords',
        configEnabledString: 'component.answeroptions.free_text_question.' + (
          this.configUseKeywords ? 'onText' : 'offText'
        ),
        enabled: this.configUseKeywords,
        disabled: () => Boolean(this.configTrimWhitespaces),
        id: 'config_use_keywords_switch',
      }, {
        configTitle: 'component.answeroptions.free_text_question.config_use_punctuation',
        configEnabledString: 'component.answeroptions.free_text_question.' + (
          this.configUsePunctuation ? 'onText' : 'offText'
        ),
        enabled: this.configUsePunctuation,
        disabled: () => Boolean(this.configTrimWhitespaces),
        id: 'config_use_punctuation_switch',
      },
    ];
  }

  public equals(answerOption: FreeTextAnswerEntity): boolean {
    return super.equals(answerOption) && answerOption.configCaseSensitive === this.configCaseSensitive && answerOption.configTrimWhitespaces
           === this.configTrimWhitespaces && answerOption.configUseKeywords === this.configUseKeywords && answerOption.configUsePunctuation
           === this.configUsePunctuation;
  }
}
